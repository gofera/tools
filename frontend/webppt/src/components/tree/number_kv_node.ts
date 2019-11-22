import * as tree from '@/components/tree';
import {KV} from '@/components/tree';

export default class NumberKvNode implements tree.Node<void, number> {
    public readonly id: number = Math.random();
    public readonly v: KV<number>;
    constructor(public readonly k: string, v: number, readOnly: boolean) {
        this.v = {
            value: v,
            editor: readOnly ? void 0 : tree.KV_EDITOR_INPUT_NUMBER,
        };
    }
}
