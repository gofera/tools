<template>
  <div class="container">
    <AppHeader class="header"></AppHeader>
    <div class="main">
      <app-sidebar class="sidebar"></app-sidebar>
      <section class="app-main"
               :class="{sidebarActivate: sidebarLocked}"
               :style="{height: sectionHeight + 'px'}">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {Getter} from 'vuex-class';
  import AppHeader from '../components/header/AppHeader.vue';
  import AppSidebar from '../components/sidebar/AppSidebar.vue';
  import {Cmd} from '../store/frame';

  @Component({
    components: {
      AppHeader,
      AppSidebar,
    },
  })
  export default class Home extends Vue {
    protected sectionHeight: number = this.getTableHeight();
    @Getter(Cmd.SIDEBAR_LOCKED) private sidebarLocked !: boolean;

    public mounted() {
      window.onresize = this.resize;
    }

    private getTableHeight(): number {
      const screenHeight = document.documentElement.clientHeight;
      return screenHeight - 40;
    }

    private resize(): void {
      this.sectionHeight = this.getTableHeight();
    }
  }
</script>


<style scoped lang="scss">
  @import '../styles/common.scss';

  .container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #eef2f6;
    .header {
      position: fixed;
      z-index: 2007;
    }
    .main {
      display: flex;
      flex: auto;
      height: 100%;
      overflow: hidden;
      .sidebar {
        position: fixed;
        margin-top: $header_height+1px;
        height: 100%;
        z-index: 100000;
      }
      .app-main {
        flex: auto;
        // overflow-y: scroll;
        // padding: $app_main_padding;
        padding-top: $header_height+$app_main_padding;
        box-sizing: border-box;
        padding-left: $sidebar_width+$app_main_padding;
        transition: all 0.3s;
      }
      .app-main:not(.sidebarActivate) {
        padding-left: $closed_sidebar_width+$app_main_padding;
        transition: all 0.5s;
      }
      @media screen and (min-width: 1280px) {
        .app-main {
          padding-left: $sidebar_width+$app_main_padding_pro;
        }
        .app-main:not(.sidebarActivate) {
          padding-left: $closed_sidebar_width+$app_main_padding_pro;
        }
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0
  }
</style>
