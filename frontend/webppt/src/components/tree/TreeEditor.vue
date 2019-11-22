<template>
    <div class="container">
        <el-form :v-loading="isLoading" class="form">
            <el-form-item>
                <el-table ref="treeTable" :data="modTree" class="tb-edit" style="width: 100%"
                          highlight-current-row default-expand-all stripe
                          :max-height="360"
                          size="mini"
                          row-key="id" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                    <el-table-column label="Key" width="380px">
                        <template scope="scope">
                            <template v-if="scope.row.k !== undefined">
                                <span v-if="scope.row.k.editor && !isReadOnly" class="kv">
                                    <el-input v-if="scope.row.k.editor === 'input'" v-model="scope.row.k.value" :placeholder="scope.row.k.placeholder"></el-input>
                                    <el-select v-if="scope.row.k.editor === 'select'" v-model="scope.row.k.value" :placeholder="scope.row.k.placeholder"
                                               @change="scope.row.k.onChanged">
                                        <el-option
                                                v-for="item in scope.row.k.options"
                                                :key="item.label"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </span>
                                <Tooltip :tooltip="scope.row.k.tooltip">
                                    <a v-if="scope.row.k.url !== void 0" :href="scope.row.k.url" target="_blank">{{scope.row.k.fmt ? scope.row.k.fmt() : scope.row.k.value !== void 0 ? scope.row.k.value : scope.row.k}}</a>
                                    <span v-else>{{scope.row.k.fmt ? scope.row.k.fmt() : scope.row.k.value !== void 0 ? scope.row.k.value : scope.row.k}}</span>
                                </Tooltip>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="Value" min-width="220px">
                        <template scope="scope">
                            <template v-if="scope.row.v !== undefined">
                                <span v-if="scope.row.v.editor && !isReadOnly" class="kv">
                                    <Tooltip v-if="scope.row.v.editor === 'input'" :tooltip="scope.row.v.tooltip">
                                        <el-input v-model="scope.row.v.value" :placeholder="scope.row.v.placeholder" type="textarea" rows=1 :autosize="{minRows: 1, maxRows: 6}"></el-input>
                                    </Tooltip>
                                    <Tooltip v-if="scope.row.v.editor === 'input-number'" :tooltip="scope.row.v.tooltip">
                                        <el-input-number style="width: 100%" v-model="scope.row.v.value"
                                                         :min="scope.row.v.min" :max="scope.row.v.max"
                                                         :placeholder="scope.row.v.placeholder"></el-input-number>
                                    </Tooltip>
                                    <el-select v-if="scope.row.v.editor === 'select'" v-model="scope.row.v.value" :placeholder="scope.row.v.placeholder"
                                                   @change="onSelectChanged(scope.row.k, scope.row.v)">
                                        <el-option
                                                v-for="item in scope.row.v.options"
                                                :key="item.label"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </span>
                                <Tooltip :tooltip="scope.row.v.tooltip">
                                    <a v-if="scope.row.v.url !== void 0" :href="scope.row.v.url" target="_blank">{{scope.row.v.fmt ? scope.row.v.fmt() : scope.row.v.value}}</a>
                                    <span v-else class="line-break">{{scope.row.v.fmt ? scope.row.v.fmt() : scope.row.v.value}}</span>
                                </Tooltip>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="Operation" width="168px" v-if="!readonly">
                        <template scope="scope">
                            <el-button v-if="scope.row.add" size="small"
                                    class="keyword-table-button"
                                    type="primary"
                                    icon="el-icon-plus"
                                    :disabled="isReadOnly"
                                    @click="scope.row.add()"
                                    circle></el-button>
                            <el-button v-if="canDelete(scope.row)" size="small"
                                    class="keyword-table-button"
                                    type="danger"
                                    icon="el-icon-delete"
                                    :disabled="isReadOnly"
                                    @click="scope.row.del()"
                                    circle></el-button>
                            <el-tooltip placement="top" v-if="scope.row.canGenAttr !== void 0 && scope.row.canGenAttr()">
                                <div slot="content">Generate Attribute</div>
                                <el-switch v-model="scope.row.isSelectedGenAttr"
                                           class="operation-item"
                                           @change="handleGenAttrChange(scope.row)"
                                           active-color="#4caf50"
                                           inactive-color="#a6a9ad"
                                ></el-switch>
                            </el-tooltip>
                            <template v-if="generateAttrs">
                                <template v-if="scope.row.children && scope.row.getLock &&scope.row.getLock() !== void 0">
                                    <el-checkbox
                                            :indeterminate="scope.row.getLock() === null"
                                            @change="scope.row.setLock()"
                                            v-model="scope.row.locked"
                                            :checked="scope.row.locked === true">Lock All</el-checkbox>
                                </template>
                                <template v-if="scope.row.locked !== void 0 && !scope.row.children">
                                    <el-button v-if="scope.row.locked"
                                               size="small"
                                               class="keyword-table-button"
                                               type="info"
                                               icon="el-icon-lock"
                                               @click="scope.row.setLock(false)"
                                               circle></el-button>
                                    <el-button v-if="!scope.row.locked"
                                               size="small"
                                               class="keyword-table-button"
                                               type="success"
                                               icon="el-icon-unlock"
                                               @click="scope.row.setLock(true)"
                                               circle></el-button>
                                </template>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>

            <el-form-item align="center" v-if="!readonly">
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
    import * as res from '@/api/resource';
    import * as tree from '@/components/tree/index';
    import * as ut from '@/util';
    import {ElTable} from 'element-ui/types/table';
    import Tooltip from '@/components/tree/Tooltip.vue';
    import {TreeEditorInput} from '@/components/tree/index';
    import {Tree} from '@/components/tree/tree';
    import Path from '@/components/tree/path';

    @Component({
        components: {
            Tooltip,
        },
    })
    export default class TreeEditor extends Base {
        protected isLoading: boolean = false;
        protected modTree: Array<tree.Node<any, any>> = [];

        @Prop() private mod!: res.Res;
        @Prop({default: false}) private readonly!: boolean;
        @Prop() private editedMod!: ut.EditedRow<res.Res>;

        @Prop({default: () => []}) private keys!: key.Key[];

        @Prop() private treeInput!: TreeEditorInput<res.Res, api.Resp>;
        private treeTable: ElTable;


        public constructor() {
            super();
            this.treeTable = this.$refs.treeTable as ElTable;
        }

        public mounted() {
            this.treeTable = this.$refs.treeTable as ElTable;
            this.onModChanged(this.mod);
        }

        protected async onSubmit() {
            try {
                await this.$confirm(`Are you sure to submit?`);
                const resp = await this.treeInput.upsert(
                    this.token, this.mod, this.modTree as Tree<res.Res>, this.generateAttrs);
                this.showRespMessage(resp, 'Upsert');
                if (resp.Code === api.RespCode.OK) {
                    this.notifySubmitted(true, this.treeInput.getRespData(resp));
                }
            } catch (e) {
                if (e === false) {  // validate fail: e will be false
                    this.showErrMsg('Fail to validate');
                } else {
                    this.showErrMsg(e);
                }
            }
        }

        protected async onClear() {
            this.notifySubmitted(false);
        }

        protected get isReadOnly(): boolean {
            return this.readonly || !this.isEditor();
        }

        protected get generateAttrs(): boolean {
            return (this.modTree as Tree<res.Res>).paths.currGenerateAttrPath !== void 0;
        }

        protected handleGenAttrChange(path: Path): void {
            const paths = (this.modTree as Tree<res.Res>).paths;
            paths.handleGenAttrChange(path);
        }

        protected onSelectChanged<K, V>(k: string|tree.KV<K>, v: tree.KV<V>): void {
            if (v.onChanged) {
                v.onChanged(v.value);
            }
            // TODO: the logic should move in case/product Tree node instead of here
            if (k === 'Product') {
                (this.modTree as Tree<res.Res>).updateKeywords(this.keys.filter((keyword) =>
                    keyword.Product === ((v.value) as unknown) as string));
            }
        }

        protected canDelete(n: tree.Node<any, any>): boolean {
            if (!n.del) {
                return false;
            }
            if (n.canDelete) {
                return n.canDelete();
            }
            return true;
        }

        @Emit('submitted')
        private notifySubmitted(submitted: boolean, updated?: res.Res) {
            // do nothing
        }

        @Watch('mod')
        private onModChanged(m: res.Res, old?: res.Res): void {
            this.modTree = this.treeInput.createTree(m, this.keys, this.treeTable, this.readonly);
        }

        @Watch('editedMod')
        private onEditedModChanged(m: ut.EditedRow<res.Res>, old: ut.EditedRow<res.Res>): void {
            if (m.row !== void 0 && m.row.ID === this.mod.ID) {
                const oldMod = this.mod;
                this.mod = m.row;
                this.onModChanged(this.mod, oldMod);
            }
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
    .el-tag + {
        margin-left: 10px;
    }
    .tb-edit .kv {
        display: none
    }
    .tb-edit .current-row .kv {
        display: inline-table;
        width: 90%;
    }
    .tb-edit .current-row .kv+span {
        display: none
    }
    .line-break {
        white-space: pre-line;
    }
    .operation-item {
        margin-left: 10px;
    }
</style>
