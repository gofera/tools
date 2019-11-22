import {ResourceTranslator} from '@/util/translator/resource';
import * as key from '@/api/key';
import * as api from '@/api';
import {Res} from '@/api/resource';
import {TreeEditorInput} from '@/components/tree';

export interface ResTableInput<T extends Res, R extends api.Resp, RS extends api.Resp> {
    getSuggestionTranslater(): ResourceTranslator;
    getKeywords(): Promise<key.KeysResp>;
    getNull(): T;
    remove(token: string, m: T): Promise<api.Resp>;
    find(opt: api.FindOpt): Promise<RS>;
    getResourcesFromResp(r: RS): T[];
    getCount(r: RS): number;
    getTreeInput(): TreeEditorInput<T, R>;
    getTopic(): string;
}

export interface SearchInput<T, RS extends api.Resp> {
    canAdd(): boolean;
    canEdit(row: T): boolean;
    canRemove(row: T): boolean;
    find(opt: api.FindOpt): Promise<RS>;
    getItemsFromResp(r: RS): T[];
    getTotalCount(r: RS): number;
    fmtID(row: T): string;
    remove(token: string, row: T): Promise<api.Resp>;
    translateSearchFilter(input: string): string;
}
