<template>
    <ResourceTable :tableInput="modelTableInput" :query="query">
    </ResourceTable>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import Base from '@/components/base';
    import ResourceTable from '@/components/search/ResourceTable.vue';
    import {ModelTableInput} from '@/components/model/table_input';

    @Component({
        components: {
            ResourceTable,
        },
    })
    export default class Model extends Base {
        @Prop() protected readonly query!: {[key: string]: string | Array<string | null>};
        protected readonly modelTableInput = new ModelTableInput();
    }
</script>

<style lang="scss" scoped>

</style>
