import * as tree from '@/components/tree/index';

// TODO: duplicate to Model, should refactory
export default class Gds implements tree.Node<void, string> {
    public readonly id: number = Math.random();
    public readonly k = 'GDS';
    public readonly v: tree.KV<string>;

    constructor(public readonly parent: tree.Node<any, any>, gdsID: string, readonly: boolean) {
        this.v = {
            value: gdsID,
            url: `#/gds?filter=_id%3D%27${gdsID}%27&limit=1`,
            tooltip: 'Gds ID',
            placeholder: 'Input the Gds ID',
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
