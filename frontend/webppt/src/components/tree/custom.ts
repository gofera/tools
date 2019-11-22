import * as tree from '@/components/tree';

export default class Custom implements tree.Node<string, string> {
    public readonly id: number = Math.random();
    public readonly k: tree.KV<string>;
    public v: tree.KV<string>;
    constructor(public readonly parent: tree.Node<any, any>, k: string, v: string) {
        this.k = {
            placeholder: 'Input a customized keyword',
            value: k,
            editor: tree.KV_EDITOR_INPUT,
        };
        this.v = {
            placeholder: 'Input a JSON',
            value: v !== '' ? JSON.stringify(v) : '',
            editor: tree.KV_EDITOR_INPUT,
            tooltip: 'should be JSON format',
        };
    }
    public del() {
        const i = this.parent.children!.indexOf(this);
        if (i >= 0) {
            this.parent.children!.splice(i, 1);
        }
    }

    public getValue(): any {
        let v = this.v.value;
        if (typeof(v) === 'string') {
            v = v.trim();
            try {
                return JSON.parse(v);
            } catch (e) {
                throw this.newValidationErr(e);
            }
        }
    }

    private newValidationErr(e: any): Error {
        return new Error(`Fail to validate custom ${this.k.value}, reason: ${e}`);
    }
}
