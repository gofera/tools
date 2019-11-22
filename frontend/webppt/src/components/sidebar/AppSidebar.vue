<template>
    <div class="sidebar" @mouseover="showSidebar" @mouseout="hideSidebar">
        <el-menu
                router
                text-color="#bfcbd9"
                :default-active="$route.path"
                class="el-menu-vertical"
                :collapse="isCollapse"
                @mouseover="showSidebar"
                @mouseout="hideSidebar">
            <el-menu-item index="/testcase" class="item">
                <i class="iconfont">&#xe904;</i>
                <span slot="title" class="title">Test Case</span>
            </el-menu-item>
            <el-menu-item index="/gds" class="item">
                <i class="iconfont">&#xe900;</i>
                <span slot="title">GDS</span>
            </el-menu-item>
            <el-menu-item index="/model" class="item">
                <i class="iconfont">&#xe902;</i>
                <span slot="title">Model</span>
            </el-menu-item>
            <el-menu-item index="/key" class="item">
                <i class="iconfont">&#xe901;</i>
                <span slot="title">Attribute</span>
            </el-menu-item>
            <el-menu-item index="/product" class="item">
                <i class="iconfont">&#xe903;</i>
                <span slot="title">Product</span>
            </el-menu-item>
            <el-menu-item index="/user" class="item" v-if="isAdmin()">
                <i class="iconfont">&#xe900;</i>
                <span slot="title">User</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator';
    import {Getter, Action} from 'vuex-class';
    import {Cmd, SideBar} from '@/store/frame';
    import Base from '@/components/base';

    @Component({})
    export default class Hamburger extends Base {
        @Getter(Cmd.SIDE_BAR) private sidebar !: SideBar;
        @Action(Cmd.TOGGLE_SIDEBAR) private toggleSidebar !: () => void;

        get isCollapse(): boolean {
            return !this.sidebar.opened;
        }

        get isLocked(): boolean {
            return this.sidebar.locked;
        }

        protected showSidebar() {
            if (this.isCollapse) {
                this.toggleSidebar();
            }
        }

        protected hideSidebar() {
            if (!this.isCollapse && !this.isLocked) {
                this.toggleSidebar();
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../../styles/common.scss';
    @import '../../element-variables.scss';
    @font-face {
      font-family: 'icomoon';
      src:  url('../../assets/fonts/icomoon.eot?1bp9e3');
      src:  url('../../assets/fonts/icomoon.eot?1bp9e3#iefix') format('embedded-opentype'),
        url('../../assets/fonts/icomoon.ttf?1bp9e3') format('truetype'),
        url('../../assets/fonts/icomoon.woff?1bp9e3') format('woff'),
        url('../../assets/fonts/icomoon.svg?1bp9e3#icomoon') format('svg');
      font-weight: normal;
      font-style: normal;
    }

    [class^="icon-"], [class*=" icon-"], .iconfont {
      /* use !important to prevent issues with browser extensions that change fonts */
      font-family: 'icomoon' !important;
      speak: none;
      font-style: normal;
      font-weight: normal;
      font-variant: normal;
      text-transform: none;
      line-height: 1;

      /* Better Font Rendering =========== */
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .icon-job:before {
      content: "\e900";
    }
    .icon-node:before {
      content: "\e901";
    }
    .icon-cluster:before {
      content: "\e902";
    }
    .icon-queue:before {
      content: "\e903";
    }
    .icon-dashboard:before {
      content: "\e904";
    }


    .sidebar {
        .el-menu--collapse {
            width: $closed_sidebar_width;
        }

        .el-menu-vertical:not(.el-menu--collapse) {
            width: $sidebar_width;
        }

        .el-menu-item {
            height: 40px;
            line-height: 40px;
            margin-bottom: 16px;
            padding: 0 15px !important;
            transition: all .3s;
            &:first-child {
                margin-top: 8px;
            }
        }

        ul {
            height: 100%;
        }

        span {
            margin-left: 16px;
        }


        .is-active {
            color: #fff;
            background-color: $--color-primary;
        }
    }


</style>
