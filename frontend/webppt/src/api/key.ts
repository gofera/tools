import * as api from '@/api';

export enum Category {
    Gds,
    GdsLayer,
    Model,
    TestCase,
}

export function categories(): Category[] {
    return [
        Category.Gds,
        Category.GdsLayer,
        Category.Model,
        Category.TestCase,
    ];
}

export function fmtCategory(c: Category): string {
    switch (c) {
        case Category.Gds:
            return 'GDS';
        case Category.GdsLayer:
            return 'GDS Layer';
        case Category.Model:
            return 'Model';
        case Category.TestCase:
            return 'Test Case';
        default:
            return `Unknown Category ${c}`;
    }
}

export function parseCategory(s: string): Category {
    switch (s) {
        case 'GDS':
            return Category.Gds;
        case 'GDS Layer':
            return Category.GdsLayer;
        case 'Model':
            return Category.Model;
        case 'Test Case':
            return Category.TestCase;
        default:
            throw new Error(`unknown category ${s}`);
    }
}

export enum ValueType {
    Undefine,
    String,
    Bool,
    Int,
    Float,
    Array,
    Map,
}

export function valueTypes(): ValueType[] {
    return [
        ValueType.Undefine,
        ValueType.String,
        ValueType.Bool,
        ValueType.Int,
        ValueType.Float,
        ValueType.Array,
        ValueType.Map,
    ];
}

export function fmtValueType(t: ValueType): string {
    switch (t) {
        case ValueType.Undefine:
            return 'Undefined';
        case ValueType.String:
            return 'String';
        case ValueType.Bool:
            return 'Boolean';
        case ValueType.Int:
            return 'Integer';
        case ValueType.Float:
            return 'Float';
        case ValueType.Array:
            return 'Array';
        case ValueType.Map:
            return 'Map';
        default:
            return `Unknown value type ${t}`;
    }
}

export interface Restrict {
    Vals: Array<string|number> | null;
    Min: number | null;
    Max: number | null;
}

export function nullRestrict(): Restrict {
    return {
        Vals: [],
        Min: null,
        Max: null,
    };
}

export interface Key {
    ID: string;
    Product: string;
    Names: string[];
    Cat: Category;
    Type: ValueType;
    Res: Restrict;
    Time: string; // last modified unix time in ns
}

export function nullKey(): Key {
    return {
        ID: '',
        Product: '',
        Names: [],
        Cat: Category.TestCase,
        Type: ValueType.Undefine,
        Res: nullRestrict(),
        Time: '0',
    };
}

export function tip(k: Key): string {
    let ret = `Type: ${fmtValueType(k.Type)}`;
    if (k.Res.Vals !== null && k.Res.Vals.length > 0) {
        ret += `; Restrict in values: [${k.Res.Vals}]`;
    }
    if (k.Res.Min !== null) {
        ret += `; Min: ${k.Res.Min}`;
    }
    if (k.Res.Max !== null) {
        ret += `; Max: ${k.Res.Max}`;
    }
    return ret;
}

// shows group in the result
export function fmtFullNames(k: Key): string {
    return k.Names.join(', ');
}

// not show group in the result
export function fmtNames(k: Key): string {
    return k.Names.map((it) => {
        const i = it.lastIndexOf('.');
        return i < 0 ? it : it.substring(i + 1);
    }).join(', ');
}

export interface KeyResp extends api.Resp {
    Key: Key;
}

export interface KeysResp extends api.Resp {
    Keys: Key[];
    Total: number|null;
}

export function upsert(token: string, k: Key): Promise<KeyResp> {
    return api.post(`api/key`, k, token);
}

export function remove(token: string, id: string): Promise<api.Resp> {
    id = encodeURIComponent(id);
    return api.del(`api/key/${id}`, token);
}

export function get(id: string): Promise<KeyResp> {
    id = encodeURIComponent(id);
    return api.get(`api/key/${id}`);
}

export function find(params: api.FindOpt): Promise<KeysResp> {
    return api.get(`api/key`, undefined, {params});
}
