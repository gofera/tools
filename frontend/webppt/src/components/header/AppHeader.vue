<template>
    <el-header class="header">
        <div class="app-header">
            <Hamburger class="my-hamburger"></Hamburger>
            <img class="logo" src="../../assets/logo.png" alt="logo">
            <div class="header-row">
                <div v-if="user.ID" class="header-item">
                    <el-checkbox
                            v-if="isAdminUser()"
                            @change="setAsAdmin()"
                            v-model="checkedAsAdmin">
                        <span>As Admin </span>
                    </el-checkbox>
                    <el-checkbox
                            v-if="isEditorUser()"
                            :disabled="checkedAsAdmin"
                            @change="setAsEditor()"
                            v-model="checkedAsEditor">
                        <span>As Editor </span>
                    </el-checkbox>
                </div>
                <div class="header-item">{{user.ID}}</div>
                <el-button type="danger" round class="header-item" @click="logout">{{loginLabel}}</el-button>
            </div>
        </div>
    </el-header>
</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator';
    import Hamburger from './Hamburger.vue';
    import * as auth from '@/store/auth';
    import {Action, Getter} from 'vuex-class';
    import * as api from '@/api';
    import {Dictionary} from 'vue-router/types/router';
    import Base from '@/components/base';

    @Component({
        components: {
            Hamburger,
        },
    })
    export default class AppHeader extends Base {
        protected checkedAsAdmin: boolean = false;
        protected checkedAsEditor: boolean = false;
        protected loginLabel: string = '';
        @Getter(auth.Cmd.GetUser) protected user !: api.User;
        @Action(auth.Cmd.ClearLoginInfo) private clearLoginInfo!: () => void;
        @Action(auth.Cmd.SetAsPermission) private setAsPermission!: (p: api.Permission) => void;

        public mounted(): void {
            this.checkedAsAdmin = this.isAdmin();
            this.checkedAsEditor = this.isEditor();
            this.loginLabel = this.user.ID !== '' ? 'Logout' : 'Login';
        }

        protected logout(): void {
            let query: Dictionary<string>|undefined;
            if (this.user.ID !== '') {
                query = {
                    user: this.user.ID,
                };
                this.clearLoginInfo();
                this.$message({
                    message: 'Logout success.',
                    type: 'success',
                });
            }
            this.$router.push({
                name: 'login',
                query,
            });
        }

        protected isAdminUser(): boolean {
            return this.user.Permission >= api.Permission.Admin;
        }

        protected setAsAdmin(): void {
            this.setAsPermission(this.checkedAsAdmin ? api.Permission.Admin : api.Permission.Editor);
            this.checkedAsEditor = true;
        }

        protected isEditorUser(): boolean {
            return this.user.Permission >= api.Permission.Editor;
        }

        protected setAsEditor(): void {
            this.setAsPermission(this.checkedAsEditor ? api.Permission.Editor : api.Permission.Viewer);
        }
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
</style>
