import {Commit} from 'vuex';

export class Cmd {
    public static readonly TOGGLE_SIDEBAR = 'toggleSidebar';
    public static readonly TOGGLE_HAM_LOCK = 'toggleHamLock';
    public static readonly SET_LOADING = 'setLoading';
    public static readonly CLEAR_LOADING = 'clearLoading';

    public static readonly SIDE_BAR = 'sidebar';
    public static readonly SIDEBAR_LOCKED = 'sidebarLocked';
    public static readonly LOADING = 'loading';
}

export interface SideBar {
    opened: boolean;
    locked: boolean;
}

export interface State {
    sidebar: SideBar;
    screenLoading: boolean;
}

const initState: State = {
    sidebar: {
        opened: true,
        locked: true,
    },
    screenLoading: false,
};

export default {
    state: initState,
    mutations: {
        [Cmd.TOGGLE_SIDEBAR]: (state: State) => state.sidebar.opened = !state.sidebar.opened,
        [Cmd.TOGGLE_HAM_LOCK]: (state: State) => state.sidebar.locked = !state.sidebar.locked,
        [Cmd.SET_LOADING]: (state: State) => state.screenLoading = true,
        [Cmd.CLEAR_LOADING]: (state: State) => state.screenLoading = false,
    },
    actions: {
        [Cmd.TOGGLE_SIDEBAR]: (ctx: { commit: Commit }) => ctx.commit(Cmd.TOGGLE_SIDEBAR),
        [Cmd.TOGGLE_HAM_LOCK]: (ctx: { commit: Commit }) => ctx.commit(Cmd.TOGGLE_HAM_LOCK),
        [Cmd.SET_LOADING]: (ctx: { commit: Commit }) => ctx.commit(Cmd.SET_LOADING),
        [Cmd.CLEAR_LOADING]: (ctx: { commit: Commit }) => ctx.commit(Cmd.CLEAR_LOADING),
    },
    getters: {
        [Cmd.SIDE_BAR]: (state: State) => state.sidebar,
        [Cmd.SIDEBAR_LOCKED]: (state: State) => state.sidebar.opened && state.sidebar.locked,
        [Cmd.LOADING]: (state: State) => state.screenLoading,
    },
};
