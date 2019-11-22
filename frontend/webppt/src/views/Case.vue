<template>
    <ResourceTable ref="resTable" :tableInput="caseTableInput">
        <template slot="colBeforePath" slot-scope="s">
            <el-table-column prop="Product" label="Product" width="95" sortable="custom"></el-table-column>
            <el-table-column prop="Name" label="Name" width="100" sortable="custom"></el-table-column>
            <el-table-column prop="Priority" label="Priority" width="110" sortable="custom"></el-table-column>
        </template>
    </ResourceTable>
</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator';
    import Base from '@/components/base';
    import ResourceTable from '@/components/search/ResourceTable.vue';
    import {CaseTableInput} from '@/components/case/table_input';
    import * as product from '@/api/product';
    import * as api from '@/api';
    import * as key from '@/api/key';
    import lodash from 'lodash';

    @Component({
        components: {
            ResourceTable,
        },
    })
    export default class Case extends Base {
        protected readonly caseTableInput = new CaseTableInput();

        public async mounted() {
            try {
                const getAllProduct = product.getAll();
                const attrTips = [this.getAttrTipForModel(), this.getAttrTipForGds(), this.getAttrTipForGdsLayer()];
                const resTable = this.$refs.resTable as ResourceTable<any, any, any>;
                for (const tip of attrTips) {
                    resTable.addSuggestion(...(await tip));
                }
                const resp = await getAllProduct;
                if (resp.Code === api.RespCode.OK) {
                    const products = resp.Prods;
                    this.caseTableInput.treeInput.products = products;
                } else {
                    this.showRespMessage(resp);
                }
            } catch (e) {
                this.showErrMsg(e);
            }
        }
        private async getAttrTipForGdsLayer(): Promise<string[]> {
            const r = await key.find({
                filter: `product="" and cat=${key.Category.GdsLayer}`,
            });
            return lodash.flatMap(r.Keys, (k) => k.Names)
                .map((name) => '${GDS.Layer.Attribute.' + name + '}');
        }
        private async getAttrTipForGds(): Promise<string[]> {
            const r = await key.find({
                filter: `product="" and cat=${key.Category.Gds}`,
            });
            return lodash.flatMap(r.Keys, (k) => k.Names)
                .map((name) => '${GDS.Attribute.' + name + '}');
        }
        private async getAttrTipForModel(): Promise<string[]> {
            const r = await key.find({
                filter: `product="" and cat=${key.Category.Model}`,
            });
            return lodash.flatMap(r.Keys, (k) => k.Names)
                .map((name) => '${Model.Attribute.' + name + '}');
        }
    }
</script>

<style lang="scss" scoped>

</style>
