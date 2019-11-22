import * as tree from '@/components/tree/index';
import * as gds from '@/api/gds';
import Previews from '@/components/gds/previews';
import Attrs from '@/components/tree/attrs';
import * as key from '@/api/key';
import Customs from '@/components/tree/customs';
import {ElTable} from 'element-ui/types/table';
import NumberKvNode from '@/components/tree/number_kv_node';

export default class GdsLayer implements tree.Node<void, string> {
    public readonly id: number = Math.random();
    public readonly k = 'GDS Layer';
    public readonly children: Array<tree.Node<any, any>> = [];
    public readonly v: tree.KV<string>;
    private readonly layer: NumberKvNode;
    private readonly dataType: NumberKvNode;
    private readonly previews: Previews;
    private readonly attrs: Attrs;
    private readonly customs: Customs;

    constructor(public readonly parent: tree.Node<any, any>, l: gds.GdsLayer, readOnly: boolean,
                keywords: key.Key[], table: ElTable) {
        this.v = {
            value: l.Name,
            tooltip: 'Name of GDS Layer',
            placeholder: 'Input the name of GDS Layer',
            editor: readOnly ? void 0 : tree.KV_EDITOR_INPUT,
        };
        this.layer = new NumberKvNode('Layer', l.Layer, readOnly);
        this.dataType = new NumberKvNode('Data Type', l.DataType, readOnly);
        this.previews = new Previews(l.Previews, readOnly);
        this.attrs = new Attrs(l.Attrs, keywords, readOnly);
        this.customs = new Customs(l.Customs, table);
        this.children.push(this.layer, this.dataType, this.previews, this.attrs, this.customs);
    }

    public toDomain(): gds.GdsLayer {
        return {
            Name: this.v.value,
            Layer: this.layer.v.value,
            DataType: this.dataType.v.value,
            Previews: this.previews.toDomain(),
            Attrs: this.attrs.toDomain(),
            Customs: this.customs.toDomain(),
        };
    }

    public del() {
        const i = this.parent.children!.indexOf(this);
        if (i >= 0) {
            this.parent.children!.splice(i, 1);
        }
    }
}
