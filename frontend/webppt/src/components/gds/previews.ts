import * as tree from '@/components/tree';
import {KV} from '@/components/tree';
import * as key from '@/api/key';

const arrayTip = 'Type is string array, should be wrapped between "[" and "]" in JSON format and item should be wrraped with double quote ""';

export default class Previews implements tree.Node<void, string> {
    public readonly id: number = Math.random();
    public readonly k = 'Previews';
    public readonly v: KV<string>;
    constructor(previews: string[], readOnly = true) {
        this.v = {
            value: JSON.stringify(previews),
            editor: readOnly ? void 0 : tree.KV_EDITOR_INPUT,
            tooltip: arrayTip,
            placeholder: 'format such as: ["v1", "v2"]',
        };
    }
    public toDomain(): string[] {
        const v = this.v.value.trim();
        if (v.length < 2 || (v[0] !== '[' && v[v.length - 1] !== ']')) {
            throw this.newValidationErr(arrayTip);
        }
        try {
            return JSON.parse(v);
        } catch (e) {
            throw this.newValidationErr(e);
        }
    }
    private newValidationErr(e: any): Error {
        return new Error(`Fail to validate Previews in GDS layer, reason: ${e}`);
    }
}
