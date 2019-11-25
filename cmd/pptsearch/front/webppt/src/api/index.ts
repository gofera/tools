import {AxiosRequestConfig} from 'axios';
import axios from 'axios';


export function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    // @ts-ignore
    return new Promise<T>((resolve, reject) => {
        axios.get(url, config)
            .then((res) => resolve(res.data))
            .catch((e) => reject(e));
    });
}

export interface SearchLine {
    Line: number;
    Section: number;
    Text: string;
}

export interface SearchResp {
    Path: string;
    Lines: SearchLine[];
}

export function search(keyword: string): Promise<SearchResp[]> {
    return get(`api/search`, {
        params: {
            keyword,
        },
    });
}

export function getWebPPTURL(): Promise<string> {
    return get(`api/webppturl`);
}
