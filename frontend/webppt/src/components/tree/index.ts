import Attribute from '@/components/tree/attr';
import Custom from '@/components/tree/custom';
import * as res from '@/api/resource';
import * as key from '@/api/key';
import * as api from '@/api';
import {ElTable} from 'element-ui/types/table';
import {Tree} from '@/components/tree/tree';

export const KV_EDITOR_INPUT = 'input';
export const KV_EDITOR_INPUT_NUMBER = 'input-number';
export const KV_EDITOR_SELECT = 'select';

export interface Option<T> {
    label: string;
    value: T;
}

export interface KV<T> {
    value: T;
    editor?: string;
    options?: Array<Option<T>>;
    placeholder?: string;
    tooltip?: string;
    min?: number;
    max?: number;
    url?: string;
    fmt?(): string;
    onChanged?(v: T): void;
}

export interface Node<K, V> {
    id: number;
    k: string|KV<K>;
    v?: string|KV<V>;
    parent?: Node<any, any>;
    children?: Array<Node<any, any>>;
    locked?: boolean;
    add?(): void;
    del?(): void;
    canDelete?(): boolean;
    setLock?(lock: boolean): void;
    // true -> item is locked
    // false -> item is unlocked
    // undefined -> item don't have value
    // null -> items are indeterminate (this is for attrs and attr_group)
    getLock?(): boolean|undefined|null;
    getUnlockedAttrs?(): string[];
}

export function extractChildrenToMap(o: {children?: any[]}, m: {[key: string]: any}) {
    if (o instanceof Attribute) {
        m[o.k.value.ID] = o.getValue();
    }
    if (o instanceof Custom) {
        m[o.k.value] = o.getValue();
    }
    if (o.children) {
        for (const c of o.children) {
            extractChildrenToMap(c, m);
        }
    }
}

export interface TreeEditorInput<T extends res.Res, R extends api.Resp> {
    createTree(origin: T, keywords: key.Key[], treeTable: ElTable, readonly: boolean): Tree<T>;
    upsert(token: string, origin: T, t: Tree<T>, toGenAttr: boolean): Promise<R>;
    getRespData(r: R): T;
}
