import * as api from '@/api';
import * as res from '@/api/resource';

export type Model = res.Res;

export function nullModel(): Model {
    return res.nullRes();
}

export interface ModelResp extends api.Resp {
    Model: Model;
}

export interface ModelsResp extends api.Resp {
    Models: Model[];
    Total: number|null;
}

export interface ModelReq extends Model, res.AttrGenable {
}

export function upsert(token: string, req: ModelReq): Promise<ModelResp> {
    return api.post(`api/model`, req, token);
}

export function remove(token: string, id: string): Promise<api.Resp> {
    id = encodeURIComponent(id);
    return api.del(`api/model/${id}`, token);
}

export function get(id: string): Promise<ModelResp> {
    id = encodeURIComponent(id);
    return api.get(`api/model/${id}`);
}

export function find(params: api.FindOpt): Promise<ModelsResp> {
    return api.get(`api/model`, undefined, {params});
}
