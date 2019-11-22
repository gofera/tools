import * as tree from '@/components/tree/index';

export default class Model implements tree.Node<void, string> {
    public readonly id: number = Math.random();
    public readonly k = 'Model';
    public readonly v: tree.KV<string>;

    constructor(public readonly parent: tree.Node<any, any>, modelID: string, readonly: boolean) {
        this.v = {
            value: modelID,
            url: `#/model?filter=_id%3D%27${modelID}%27&limit=1`,
            tooltip: 'Model ID',
            placeholder: 'Input the Model ID',
            editor: readonly ? void 0 : tree.KV_EDITOR_INPUT,
        };
    }

    public del() {
        const i = this.parent.children!.indexOf(this);
        if (i >= 0) {
            this.parent.children!.splice(i, 1);
        }
    }
}
