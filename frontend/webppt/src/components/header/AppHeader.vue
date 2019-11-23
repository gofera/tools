<template>
    <el-header class="header">
        <div class="app-header">
            <h1 class="title">Web PPT</h1>
        </div>
    </el-header>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';

    @Component
    export default class AppHeader extends Vue {

    }
</script>

<style scoped lang="scss">
    @import '../../styles/common.scss';
    @import '../../styles/index.scss';

    .app-header {
        display: flex;
        align-items: center;
        width: 100%;
        height: $header_height;
        color: #0f228b;
        background-color: rgb(255, 255, 255);
        border-bottom: 2px solid rgb(243, 243, 243);
        .my-hamburger {
            margin: 0 15px;
        }
        #title {
            display: inline-block;
            margin: 0;
            font-size: 24px;
        }
        .logo {
            height: 24px
        }
    }
    .header {
        position: fixed;
        display: block;
        width: 100%;
        padding: 0;
    }
    .header-row {
        display: flex;
        align-items: center;
        flex-flow: row wrap;
        margin: 0 10px;
        width: 100%;
        justify-content: flex-end;
        .header-item {
            margin: 1em;
            display: flex;
            align-items: center;
            flex-flow: row wrap;
        }
    }
    .title {
        width: 100%;
        text-align: center;
    }
</style>
