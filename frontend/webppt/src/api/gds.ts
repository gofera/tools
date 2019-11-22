import * as api from '@/api';
import * as res from '@/api/resource';

export interface Gds extends res.Res {
    Lambda: Lambda[];
    Layers: GdsLayer[];
}

export function nullGds(): Gds {
    return Object.assign(res.nullRes(), {
        Lambda: [],
        Layers: [],
    });
}

export interface Lambda {
    ID: string;
    Path: string;
}

export function nullLambda(): Lambda {
    return {
        ID: '',
        Path: '',
    };
}

export interface GdsLayer {
    Name: string;
    Layer: number;
    DataType: number;
    Previews: string[];
    Attrs: {[key: string]: any};
    Customs: {[key: string]: any};
}

export function nullGdsLayer(): GdsLayer {
    return {
        Name: '',
        Layer: 0,
        DataType: 0,
        Previews: [],
        Attrs: {},
        Customs: {},
    };
}

export interface GdsResp extends api.Resp {
    Gds: Gds;
}

export interface GdssResp extends api.Resp {
    Gdss: Gds[];
    Total: number|null;
}

export interface GdsReq extends Gds, res.AttrGenable {
}

export function upsert(token: string, m: GdsReq): Promise<GdsResp> {
    return api.post(`api/gds`, m, token);
}

export function remove(token: string, id: string): Promise<api.Resp> {
    id = encodeURIComponent(id);
    return api.del(`api/gds/${id}`, token);
}

export function get(id: string): Promise<GdsResp> {
    id = encodeURIComponent(id);
    return api.get(`api/gds/${id}`);
}

export function find(params: api.FindOpt): Promise<GdssResp> {
    return api.get(`api/gds`, undefined, {params});
}
