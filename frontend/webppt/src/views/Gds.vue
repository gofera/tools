<template>
    <ResourceTable ref="resTable" :tableInput="gdsTableInput" :query="query">
    </ResourceTable>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import Base from '@/components/base';
    import ResourceTable from '@/components/search/ResourceTable.vue';
    import {GdsTableInput} from '@/components/gds/table_input';
    import * as key from '@/api/key';
    import lodash from 'lodash';

    @Component({
        components: {
            ResourceTable,
        },
    })
    export default class Gds extends Base {
        @Prop() protected readonly query!: {[key: string]: string | Array<string | null>};
        protected readonly gdsTableInput = new GdsTableInput();

        public async mounted() {
            try {
                const r = await key.find({
                    filter: `product="" and cat=${key.Category.GdsLayer}`,
                });
                this.gdsTableInput.treeInput.gdsLayerKeys = r.Keys;
                // use lodash.flatMap instead of keywords.flatMap is because to use in old browser such as Edge
                const attrTips = lodash.flatMap(r.Keys, (k) => k.Names)
                    .map((name) => '${Layer.Attribute.' + name + '}');
                const resTable = this.$refs.resTable as ResourceTable<any, any, any>;
                resTable.addSuggestion(...attrTips);
            } catch (e) {
                this.showErrMsg(e);
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
