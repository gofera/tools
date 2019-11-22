<template>
    <div class="container">
        <el-form :model="dict" :rules="rules" ref="dict" :v-loading="isLoading" class="form">
            <el-form-item label="Product" label-width="120px">
                <el-select :disabled="isReadOnly" v-model="dict.Product" placeholder="Select" class="form-item">
                    <el-option
                            v-for="item in products"
                            :key="item.ID"
                            :label="item.Name === '' ? 'Sharing' : item.Name"
                            :value="item.Name"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Name" label-width="120px">
                <Tags :dynamicTags="dict.Names" :disabled="isReadOnly"></Tags>
            </el-form-item>
            <el-form-item label="Category" label-width="120px">
                <el-select :disabled="isReadOnly" v-model="dict.Cat" placeholder="Select" class="form-item">
                    <el-option
                            v-for="item in categories"
                            :key="item"
                            :label="formatCategory(item)"
                            :value="item"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Value Type" label-width="120px">
                <el-select :disabled="isReadOnly" v-model="dict.Type" placeholder="Select" class="form-item"
                           @change="onValueTypeChanged">
                    <el-option
                            v-for="item in valueTypes"
                            :key="item"
                            :label="formatValueType(item)"
                            :value="item"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Restrict" label-width="120px">
                <el-radio-group v-model="restrictMode" :disabled="!enableRestrict()">
                    <el-radio :label="0">Nothing</el-radio>
                    <el-radio :label="1">By List</el-radio>
                    <el-radio :label="2" :disabled="!enableRangeRestrict()">By Range</el-radio>
                </el-radio-group>
                <div v-if="restrictMode === 1">
                    <el-tag
                            :key="tag"
                            v-for="tag in dict.Res.Vals"
                            closable
                            :disable-transitions="false"
                            @close="onRestrictValueClose(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input
                            class="input-new-tag"
                            v-if="restrictValueInputVisible"
                            v-model="restrictInputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleRestrictValueInputConfirm"
                            @blur="handleRestrictValueInputConfirm"
                            :type="restrictInputValueType"
                    ></el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="onShowRestrictValueInput">+ New Tag</el-button>
                </div>
                <div v-else-if="restrictMode === 2">
                    <div>
                        <el-checkbox v-model="hasMin" @change="onHasMinChanged">Min:</el-checkbox>
                        <el-input-number v-if="hasMin" v-model="dict.Res.Min" label="Min" style="margin: 5px 10px;"></el-input-number>
                    </div>
                    <div>
                        <el-checkbox v-model="hasMax" @change="onHasMaxChanged">Max:</el-checkbox>
                        <el-input-number v-if="hasMax" v-model="dict.Res.Max" label="Max" style="margin: 5px 10px;"></el-input-number>
                    </div>
                </div>
            </el-form-item>

            <el-form-item align="center">
                <el-button type="danger" @click="onClear()">Cancel</el-button>
                <el-button type="primary" :disabled="isReadOnly" @click="onSubmit()">Submit</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Emit, Watch} from 'vue-property-decorator';
    import Base from '@/components/base';
    import * as api from '@/api';
    import * as key from '@/api/key';
    import * as product from '@/api/product';
    import Tags from './Tags.vue';

    enum RestrictMode {
        NO_RESTRICT,
        LIST,
        RANGE,
    }

    @Component({
        components: {
            Tags,
        },
    })
    export default class KeyEditor extends Base {
        protected isLoading: boolean = false;
        protected dict: key.Key = key.nullKey();
        protected products: product.Product[] = [];
        protected readonly categories: key.Category[] = key.categories();
        protected readonly valueTypes: key.ValueType[] = key.valueTypes();
        protected readonly rules = {
            Name: [{ required: true, message: `Input keyword's name`, trigger: 'blur' }],
        };
        protected restrictMode: RestrictMode = RestrictMode.NO_RESTRICT;
        protected restrictValueInputVisible: boolean = false;
        protected restrictInputValue: string = '';
        protected hasMin = false;
        protected hasMax = false;

        @Prop() private keyword!: key.Key;

        public async mounted() {
            this.isLoading = true;
            this.onKeywordUpdated(this.keyword, this.keyword);
            try {
                await this.fetchProducts();
            } catch (e) {
                this.showErrMsg(e, 'Fetch Products');
            }
            this.isLoading = false;
        }

        protected async onSubmit() {
            const errMsg = this.validateNames();
            if (errMsg !== '') {
                this.showErrMsg(errMsg);
                return;
            }
            try {
                await this.$confirm(`Are you sure to submit the new keyword?`);
                await (this.$refs.dict as any).validate();

                this.updateRestrictFromUI();

                const resp = await key.upsert(this.token, this.dict);
                this.showRespMessage(resp, 'New Keyword');
                if (resp.Code === api.RespCode.OK) {
                    this.dict = key.nullKey();
                    this.notifySubmitted(true, resp.Key);
                }
            } catch (e) {
                if (e === false) {  // validate fail: e will be false
                    this.showErrMsg('Fail to validate');
                }
            }
        }

        protected async onClear() {
            this.notifySubmitted(false);
        }

        protected get isReadOnly(): boolean {
            return !this.isAdmin();
        }

        protected formatCategory(c: key.Category): string {
            return key.fmtCategory(c);
        }

        protected formatValueType(t: key.ValueType): string {
            return key.fmtValueType(t);
        }

        protected onRestrictValueClose(tag: string) {
            if (this.dict.Res.Vals !== null && this.dict.Res.Vals.length > 0) {
                this.dict.Res.Vals.splice(this.dict.Res.Vals.indexOf(tag), 1);
            }
        }

        protected onShowRestrictValueInput() {
            this.restrictValueInputVisible = true;
            this.$nextTick(() => {
                const saveTagInput: any = (this.$refs as any).saveTagInput;
                const input: any = (saveTagInput.$refs as any).input;
                input.focus();
            });
        }

        protected handleRestrictValueInputConfirm() {
            const inputValue = this.restrictInputValue;
            if (inputValue) {
                if (this.dict.Res.Vals === null) {
                    this.dict.Res.Vals = [inputValue];
                } else {
                    this.dict.Res.Vals.push(inputValue);
                }
            }
            this.restrictValueInputVisible = false;
            this.restrictInputValue = '';
        }

        protected onValueTypeChanged() {
            this.restrictMode = RestrictMode.NO_RESTRICT;
            this.dict.Res.Vals = [];
        }

        protected enableRestrict(): boolean {
            return this.enableRangeRestrict() || [
                key.ValueType.String,
            ].includes(this.dict.Type);
        }

        protected enableRangeRestrict(): boolean {
            return [
                key.ValueType.Float,
                key.ValueType.Int,
            ].includes(this.dict.Type);
        }

        protected get restrictInputValueType(): string {
            return this.enableRangeRestrict() ? 'number' : 'text';
        }

        protected onHasMinChanged() {
            if (this.hasMin) {
                this.dict.Res.Min = 0;
            } else {
                this.dict.Res.Min = null;
            }
        }

        protected onHasMaxChanged() {
            if (this.hasMax) {
                this.dict.Res.Max = 0;
            } else {
                this.dict.Res.Max = null;
            }
        }

        private async fetchProducts() {
            const r = await product.getAll();
            if (r.Code === api.RespCode.OK) {
                this.products = [product.getNull(), ...r.Prods];
            } else {
                this.showRespMessage(r, 'Fetch Products');
            }
        }

        private updateRestrictFromUI(): void {
            switch (this.restrictMode) {
                case RestrictMode.NO_RESTRICT: // nothing restrict
                    this.dict.Res = key.nullRestrict();
                    break;
                case RestrictMode.LIST: // by list
                    let parse: any;
                    switch (this.dict.Type) {
                        case key.ValueType.Int:
                            parse = parseInt;
                            break;
                        case key.ValueType.Float:
                            parse = parseFloat;
                            break;
                    }
                    if (this.dict.Res.Vals === null) {
                        this.dict.Res.Vals = [];
                    }
                    if (parse) {
                        for (let i = 0; i < this.dict.Res.Vals!.length; i++) {
                            this.dict.Res.Vals![i] = parse(this.dict.Res.Vals![i]);
                        }
                    }
                    break;
                case RestrictMode.RANGE: // by range
                    if (!this.hasMin) {
                        this.dict.Res.Min = null;
                    }
                    if (!this.hasMax) {
                        this.dict.Res.Max = null;
                    }
                    break;
                default:
                    this.showErrMsg(`Unknown restrict mode ${this.restrictMode}`);
                    break;
            }
        }

        @Emit('submitted')
        private notifySubmitted(submitted: boolean, k?: key.Key) {
            // do nothing
        }

        @Watch('keyword')
        private onKeywordUpdated(v: key.Key, old: key.Key) {
            this.dict = v;
            if (v.Res.Vals !== null && v.Res.Vals.length > 0) {
                this.restrictMode = RestrictMode.LIST;
            } else if (api.isNullOrUndefined(v.Res.Min) && api.isNullOrUndefined(v.Res.Max)) {
                this.restrictMode = RestrictMode.NO_RESTRICT;
            } else {
                this.restrictMode = RestrictMode.RANGE;
                this.hasMin = !api.isNullOrUndefined(v.Res.Min);
                this.hasMax = !api.isNullOrUndefined(v.Res.Max);
            }
        }

        // return error message
        private validateNames(): string {
            if (this.dict.Names.length === 0) {
                return 'Please specify at least one name for the keyword';
            }
            // validate names
            let group: string|undefined = void 0;
            for (const name of this.dict.Names) {
                if (group === void 0) {
                    const i = name.lastIndexOf('.');
                    group = i < 0 ? '' : name.substring(0, i);
                }
                if ((group !== '' && !name.startsWith(group + '.')) || (group === '' && name.includes('.'))) {
                    return 'All names should have the same group (the same prefix if contains dot)';
                }
                if (name.includes(' ')) {
                    return 'Name should not contain space';
                }
            }
            return '';
        }
    }
</script>

<style scoped>
    .container {
        height: 100%;
        margin: 0px auto;
        background: white;
    }
    .form {

    }
    .form-item {
        width: 250px;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>
