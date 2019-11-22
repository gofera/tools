import * as api from '@/api';

export interface Product {
    ID: string;
    Name: string;
    Time: string;  // last modified unix time in ns
}

export function getNull(): Product {
    return {
        ID: '',
        Name: '',
        Time: '0',
    };
}

export interface ProdResp extends api.Resp {
    Prod?: Product;
}

export interface ProdsResp extends api.Resp {
    Prods: Product[];
}

export function add(token: string, name: string): Promise<ProdResp> {
    name = encodeURIComponent(name);
    return api.post(`api/product/${name}`, undefined, token);
}

export function getAll(): Promise<ProdsResp> {
    return api.get(`api/product`);
}

export function update(token: string, p: Product): Promise<api.Resp> {
    return api.put(`api/product`, p, token);
}

export function remove(token: string, name: string): Promise<api.Resp> {
    name = encodeURIComponent(name);
    return api.del(`api/product/${name}`, token);
}
