import * as api from '@/api/index';

export interface UserPerm {
    Email: string;
    Perm: api.Permission;
}

// should not define a const value because always pointer assignment instead of copy
export function getNullUserPerm(): UserPerm {
    return {
        Email: '',
        Perm: api.Permission.Editor,
    };
}

export function upsert(token: string, userPerm: UserPerm): Promise<api.Resp> {
    return api.post('api/perm', userPerm, token);
}

export interface PermsResp extends api.Resp {
    Perms: UserPerm[];
}

export function getAll(token: string): Promise<PermsResp> {
    return api.get('api/perm', token);
}

export function remove(token: string, email: string): Promise<api.Resp> {
    email = encodeURIComponent(email);
    return api.del(`api/perm/${email}`, token);
}
