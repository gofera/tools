import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import frame from './frame';
import auth, {State as AuthState, Cmd as AuthCmd} from './auth';

Vue.use(Vuex);

export interface State {
    auth: AuthState;
}

const vuexLocal = new VuexPersistence<State> ({
    storage: window.localStorage,
    reducer: (state: State) => ({
        auth: state.auth,
    }),
    filter: (mutation: any) => {
        return [
            AuthCmd.SetLoginResp, AuthCmd.ClearLoginInfo, AuthCmd.SetAsPermission,
        ].includes(mutation.type);
    },
});

const store = new Vuex.Store<State>({
    modules: {
        frame,
        auth,
    },
    plugins: [vuexLocal.plugin],
    actions: {
    },
    getters: {
    },
});

export default store;
