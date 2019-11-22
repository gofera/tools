import {Commit} from 'vuex';
import * as api from '@/api';
import * as auth from '@/api/auth';

export interface State {
    user: api.User;
    token: string;
    asPermission: api.Permission;
}

const initState: State = {
    user: api.getNullUser(),
    token: '',
    asPermission: api.Permission.Viewer,
};

export class Cmd {
    public static readonly SetLoginResp = 'SetLoginResp';
    public static readonly ClearLoginInfo = 'ClearLoginInfo';
    public static readonly GetUser = 'GetUser';
    public static readonly GetToken = 'GetToken';
    public static readonly GetAsPermission = 'GetAsPermission';
    public static readonly SetAsPermission = 'SetAsPermission';
}

export default {
    state: initState,
    mutations: {
        [Cmd.SetLoginResp](s: State, r: auth.LoginResp) {
            s.user = r.User!;
            s.token = r.Content;
        },
        [Cmd.ClearLoginInfo](s: State) {
            s.user = api.getNullUser();
            s.token = initState.token;
            s.asPermission = api.Permission.Viewer;
        },
        [Cmd.SetAsPermission](s: State, p: api.Permission) {
            s.asPermission = p;
        },
    },
    actions: {
        [Cmd.SetLoginResp](ctx: { commit: Commit }, r: auth.LoginResp) {
            ctx.commit(Cmd.SetLoginResp, r);
        },
        [Cmd.ClearLoginInfo](ctx: { commit: Commit }) {
            ctx.commit(Cmd.ClearLoginInfo);
        },
        [Cmd.SetAsPermission](ctx: { commit: Commit }, p: api.Permission) {
            ctx.commit(Cmd.SetAsPermission, p);
        },
    },
    getters: {
        [Cmd.GetUser]: (s: State) => s.user,
        [Cmd.GetToken]: (s: State) => s.token,
        [Cmd.GetAsPermission]: (s: State) => s.asPermission,
    },
};

export let passwd: string;

// as import module var cannot change the value, so need the setter function
export function setPasswd(p: string) {
    passwd = p;
}
