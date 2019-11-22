import * as api from '@/api';
import * as res from '@/api/resource';
import {Gds} from '@/api/gds';
import {Model} from '@/api/model';

export interface Case extends res.Res {
    Product: string;
    Name: string;
    QTest: QTest;
    Priority: number;
    Gdses: string[];
    Models: string[];

    // the detail of GDS and Models, no used now
    Gds: Gds[];
    Model: Model[];
}

export function nullCase(): Case {
    return Object.assign(res.nullRes(), {
        Product: '',
        Name: '',
        QTest: nullQTest(),
        Priority: 0,
        Gdses: [],
        Models: [],
        Gds: [],
        Model: [],
    });
}

export interface QTest {
    Name: string;
    Url: string;
}

export function nullQTest(): QTest {
    return {
        Name: '',
        Url: '',
    };
}

export interface CaseResp extends api.Resp {
    Case: Case;
}

export interface CasesResp extends api.Resp {
    Cases: Case[];
    Total: number|null;
}

export interface CaseReq extends Case, res.AttrGenable {
}

export function upsert(token: string, m: CaseReq): Promise<CaseResp> {
    // clean gds and model as no used in server so as to decrease web band width, as gds and model may be very large
    m.Gds = [];
    m.Model = [];
    return api.post(`api/case`, m, token);
}

export function remove(token: string, id: string): Promise<api.Resp> {
    id = encodeURIComponent(id);
    return api.del(`api/case/${id}`, token);
}

export function get(id: string): Promise<CaseResp> {
    id = encodeURIComponent(id);
    return api.get(`api/case/${id}`);
}

export function find(params: api.FindOpt): Promise<CasesResp> {
    return api.get(`api/case`, undefined, {params});
}
