import * as api from '@/api/index';

export interface LoginResp extends api.Resp {
    User?: api.User;
}

export function login(user: string, passwd: string): Promise<LoginResp> {
    return api.post('api/login', {
        User: user,
        Passwd: passwd,
    });
}
