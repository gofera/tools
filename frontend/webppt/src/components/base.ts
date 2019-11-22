import {Vue} from 'vue-property-decorator';
import * as api from '@/api';
import * as authApi from '@/api/auth';
import * as authStore from '@/store/auth';
import {Action, Getter} from 'vuex-class';
import {ElMessageComponent} from 'element-ui/types/message';

export default class Base extends Vue {
    @Getter(authStore.Cmd.GetUser) protected user !: api.User;
    @Getter(authStore.Cmd.GetToken) protected token !: string;
    @Getter(authStore.Cmd.GetAsPermission) protected perm !: api.Permission;
    @Action(authStore.Cmd.SetLoginResp) protected setLoginResp!: (u: authApi.LoginResp) => void;

    protected showRespMessage(r: api.Resp, prefix?: string): ElMessageComponent {
        return this.$message(api.getRespMessage(r, prefix));
    }

    protected showErrMsg(e: any, prefix?: string): ElMessageComponent {
        const msg = (prefix ? prefix + ' ' : '') + e;
        return this.$message({
            message: msg,
            type: 'error',
            offset: 150,
            showClose: true,
        });
    }

    // retry once if token is expired
    protected async callApiWithToken<T extends api.Resp>(fn: (token: string) => Promise<T>): Promise<T> {
        let r = await fn(this.token);
        if (api.isTokenExpired(r)) {
            const resp = await authApi.login(this.user.ID, authStore.passwd);
            if (resp.Code === api.RespCode.OK) {
                this.setLoginResp(resp);
                r = await fn(this.token);
            }
        }
        return r;
    }

    protected isAdmin(): boolean {
        return this.perm >= api.Permission.Admin;
    }

    protected isEditor(): boolean {
        return this.perm >= api.Permission.Editor;
    }
}
