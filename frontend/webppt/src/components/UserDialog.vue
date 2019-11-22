<template>
<el-dialog :title="topicTitle" @close="closeDialog(false)" :visible.sync="toShowDialog" :close-on-click-modal="false" width="450px">
    <el-form :model="usr">
        <el-form-item label="Email" label-width="120px">
            <el-input :disabled="toModify" class="form-item" v-model="usr.Email"
                      @keyup.enter.native="onConfirm" placeholder="Input user's Email"></el-input>
        </el-form-item>
        <el-form-item label="Permission" label-width="120px">
            <el-select v-model="usr.Perm" placeholder="Select" class="form-item">
                <el-option
                        v-for="item in permissionOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(false)">Cancel</el-button>
        <el-button type="primary" :disabled="usr.Email.trim() === ''" @click="onConfirm">Confirm</el-button>
    </span>
</el-dialog>
</template>

<script lang="ts">
import {Component, Prop, Emit, Watch} from 'vue-property-decorator';
import * as api from '@/api';
import * as perm from '@/api/perm';
import Base from '@/components/base';

@Component
export default class UserDialog extends Base {
    protected readonly permissionOptions = [
        {
            value: api.Permission.Viewer,
            label: 'Viewer Permission',
        }, {
            value: api.Permission.Editor,
            label: 'Editor Permission',
        }, {
            value: api.Permission.Admin,
            label: 'Admin Permission',
        },
    ];
    protected toModify: boolean = false;
    protected toShowDialog: boolean = false;
    protected usr: perm.UserPerm = perm.getNullUserPerm();
    @Prop() private userPerm !: perm.UserPerm;
    @Prop({default: false}) private showDialog!: boolean;

    protected async onConfirm() {
        this.usr.Email = this.usr.Email.trim();
        if (this.usr.Email === '') {
            return;
        }
        try {
            const r = await this.callApiWithToken((token) => perm.upsert(token, this.usr));
            this.showRespMessage(r, this.topicTitle);
            this.closeDialog(r.Code === api.RespCode.OK);
        } catch (e) {
            this.showErrMsg(e, this.topicTitle);
        }
    }

    protected get topicTitle(): string {
        return (this.toModify ? 'Update User Permission' : 'New User Permission');
    }

    @Emit('closeDialog')
    private closeDialog(ifConfirm: boolean) {
        // do nothing
    }

    @Watch('showDialog')
    private onShowDialogChanged(v: boolean, old: boolean): void {
        this.toShowDialog = v;
        if (this.toShowDialog) {
            this.usr = this.userPerm;
            this.toModify = this.usr.Email !== '';
        }
    }

    @Watch('userPerm')
    private onUserPermChanged(v: perm.UserPerm, old: perm.UserPerm): void {
        this.usr = v;
    }
}
</script>

<style scoped lang="scss">
    .form-item {
        width: 250px;
    }
</style>
