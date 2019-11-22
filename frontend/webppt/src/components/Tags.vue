<template>
    <div>
        <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                :closable="!disabled"
                :disable-transitions="false"
                @close="handleClose(tag)">
            {{tag}}
        </el-tag>
        <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
        >
        </el-input>
        <el-button :disabled="disabled" v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Emit, Watch} from 'vue-property-decorator';

    @Component
    export default class Tags extends Vue {
        @Prop() protected dynamicTags !: string[];
        @Prop({default: false}) protected disabled !: boolean;
        protected inputVisible = false;
        protected inputValue = '';

        protected handleClose(tag: string): void {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        }

        protected showInput(): void {
            this.inputVisible = true;
            this.$nextTick(() => {
                const saveTagInput: any = (this.$refs as any).saveTagInput;
                const input: any = (saveTagInput.$refs as any).input;
                input.focus();
            });
        }

        protected handleInputConfirm(): void {
            const inputValue = this.inputValue;
            if (inputValue) {
                this.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        }
    }
</script>

<style scoped>
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
