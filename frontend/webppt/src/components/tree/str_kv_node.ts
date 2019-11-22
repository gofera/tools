import * as tree from '@/components/tree';
import {KV} from '@/components/tree';

export default class StrKvNode implements tree.Node<void, string> {
    public readonly id: number = Math.random();
    public readonly v: KV<string>;
    constructor(public readonly k: string, v: string, readOnly = true) {
        this.v = {
            value: v,
            editor: readOnly ? void 0 : tree.KV_EDITOR_INPUT,
        };
    }
}
