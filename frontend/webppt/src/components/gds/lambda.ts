import * as tree from '@/components/tree/index';
import * as gds from '@/api/gds';
import StrKvNode from '@/components/tree/str_kv_node';

export default class Lambda implements tree.Node<void, string> {
    public readonly id: number = Math.random();
    public readonly k = 'Lambda';
    public readonly v: tree.KV<string>;
    public readonly children: Array<tree.Node<void, string>> = [];
    private readonly lambdaPath: StrKvNode;

    constructor(public readonly parent: tree.Node<any, any>, ld: gds.Lambda, readonly: boolean) {
        this.v = {
            value: ld.ID,
            tooltip: 'Lambda ID',
            placeholder: 'Input the Lambda ID',
            editor: readonly ? void 0 : tree.KV_EDITOR_INPUT,
        };
        this.lambdaPath = new StrKvNode('Path', ld.Path, readonly);
        this.children.push(this.lambdaPath);
    }

    public toDomain(): gds.Lambda {
        return {
            ID: this.v.value,
            Path: this.lambdaPath.v.value,
        };
    }

    public del() {
        const i = this.parent.children!.indexOf(this);
        if (i >= 0) {
            this.parent.children!.splice(i, 1);
        }
    }
}
