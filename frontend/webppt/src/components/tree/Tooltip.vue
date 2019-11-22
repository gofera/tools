<template>
    <span>
        <el-tooltip v-if="tooltip" placement="top">
            <div slot="content">{{tooltip}}</div>
            <slot></slot>
        </el-tooltip>
        <slot v-else></slot>
    </span>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator';

    @Component
    export default class Tooltip extends Vue {
        @Prop() protected tooltip?: string;
    }
</script>

<style scoped>

</style>
