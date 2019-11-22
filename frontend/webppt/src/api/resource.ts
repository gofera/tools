import * as api from '@/api/index';

export interface Res {
    ID: string;
    MD5: string;
    Paths: string[];
    Attrs: {[key: string]: any};
    Customs: {[key: string]: any};
    Created: api.UserAndTime;
    LastModified: api.UserAndTime;
    Status: api.Status;
    Err: string;
    Comment: string;
}

export function nullRes(): any {
    return {
        ID: '',
        MD5: '',
        Paths: [],
        Attrs: {},
        Customs: {},
        Created: api.nullUserAndTime(),
        LastModified: api.nullUserAndTime(),
        Status: api.Status.DONE,
        Err: '',
        Note: '',
    };
}

export interface AttrGenReq {
    Path: string;
    UnlockedAttrs: string[];
}

export interface AttrGenable {
    AttrGen?: AttrGenReq;
}
