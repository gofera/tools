<template>
  <el-container class="user" v-loading="isLoading">
    <div class="user-search">
      <el-input
              class="user-search-input"
              prefix-icon="el-icon-search"
              placeholder="Search by user's email"
              v-model="searchKey">
      </el-input>
      <el-button
              class="user-search-button"
              type="primary"
              @click="addUserPerm"><i class="el-icon-plus"></i></el-button>
    </div>
    <el-table
            class="user-table"
            stripe
            v-loading="isLoading"
            :data="searchDataList"
            element-loading-text="loading"
            empty-text="No matching users found."
            :height="600"
    >
      <el-table-column prop="Email" label="Email" width="300" resizable sortable></el-table-column>
      <el-table-column prop="Perm" label="Permission" :formatter="formatUserPermission" width="200" resizable sortable></el-table-column>
      <el-table-column
              label="Operations"
              width="200">
        <template slot-scope="props">
          <el-container class="user-table-button-list">
            <el-button
                    class="user-table-button"
                    type="primary"
                    icon="el-icon-edit"
                    @click="updateUserPerm(props.row)"
                    circle></el-button>
            <el-button
                    class="user-table-button"
                    type="danger"
                    icon="el-icon-delete"
                    @click="deleteUserPerm(props.row)"
                    circle></el-button>
          </el-container>
        </template>
      </el-table-column>
    </el-table>
    <UserDialog
            :showDialog="showDlg"
            @updateName="updateUserPerm"
            @closeDialog="closeDialog"
            :userPerm="usr"
    ></UserDialog>
  </el-container>
</template>

<script lang="ts">
  import {Watch, Component} from 'vue-property-decorator';
  import * as api from '@/api';
  import * as perm from '@/api/perm';
  import UserDialog from '@/components/UserDialog.vue';
  import Base from '@/components/base';

  @Component({
    components: {
      UserDialog,
    },
  })
  export default class User extends Base {
    protected readonly usr: perm.UserPerm = perm.getNullUserPerm();
    protected userPerms: perm.UserPerm[] = [];
    protected showDlg: boolean = false;
    protected isLoading: boolean = false;
    protected searchKey: string = '';

    public async mounted() {
      this.isLoading = true;
      try {
        await this.fetchUserPerms();
      } catch (e) {
        this.showErrMsg(e, 'Fetch Permissions');
      }
      this.isLoading = false;
    }

    public get searchDataList(): perm.UserPerm[] {
      return this.userPerms.filter((u: perm.UserPerm) =>
              u.Email.toLowerCase().includes(this.searchKey.toLowerCase()));
    }

    protected addUserPerm(): void {
      this.updateUserPerm(perm.getNullUserPerm());
    }

    protected updateUserPerm(u: perm.UserPerm) {
      Object.assign(this.usr, u);  // copy content instead of reference
      this.showDlg = true;
    }

    protected async deleteUserPerm(u: perm.UserPerm) {
      try {
        await this.$confirm(`Are you sure to delete permission of ${u.Email}?`);
        this.isLoading = true;
        try {
          const r = await this.callApiWithToken((token) => perm.remove(token, u.Email));
          this.showRespMessage(r, 'Delete Permission');
          if (r.Code === api.RespCode.OK) {
            await this.fetchUserPerms();
          }
        } catch (e) {
          this.showErrMsg(e, 'Delete Permission');
        }
        this.isLoading = false;
      } catch (e) {
        // do nothing
      }
    }

    protected async closeDialog(ifConfirm: boolean) {
      if (!this.showDlg) { // prevent call twice
        return;
      }
      this.showDlg = false;
      if (ifConfirm) {
        this.isLoading = true;
        try {
          await this.fetchUserPerms();
        } catch (e) {
          this.showErrMsg(e, 'Fetch Permissions');
        }
        this.isLoading = false;
      }
    }

    protected formatUserPermission(u: perm.UserPerm): string {
      return api.formatPermission(u.Perm);
    }

    @Watch('perm')
    private onAdminChange(val: api.Permission, old: api.Permission) {
      if (val < api.Permission.Admin) {
        this.$router.push('/');
      }
    }

    private async fetchUserPerms() {
      const r = await this.callApiWithToken(perm.getAll);
      if (r.Code === api.RespCode.OK) {
        this.userPerms = r.Perms;
      } else {
        this.showRespMessage(r, 'Fetch Permissions');
      }
    }
  }
</script>

<style lang='scss' scoped>
  .user {
    height:100%;
    width: 750px;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    padding: 10px 10px;
    background-color: white;
    .user-search {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      height: 60px;
      margin-bottom: 20px;
      .user-search-button {
        margin-left: 10px;
      }
    }
    .user-table-button-list {
      display: flex;
      .user-table-button {
      }
    }
    .user-table {
      height: 100%;
    }
  }
</style>
