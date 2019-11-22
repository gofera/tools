import * as tree from '@/components/tree';
import * as gds from '@/api/gds';
import {ElTable} from 'element-ui/types/table';
import GdsLayer from '@/components/gds/layer';
import * as key from '@/api/key';

export default class GdsLayers implements tree.Node<void, void> {
    public readonly id: number = Math.random();
    public readonly k: string = 'GDS Layers';
    public readonly children: GdsLayer[] = [];

    constructor(lambdas: gds.GdsLayer[], private table: ElTable, private readOnly: boolean,
                private keywords: key.Key[]) {
        for (const l of lambdas) {
            this.addGdsLayer(l);
        }
    }

    public toDomain(): gds.GdsLayer[] {
        return this.children.map((it) => it.toDomain());
    }

    public add() {
        const p = this.addGdsLayer(gds.nullGdsLayer());
        setTimeout(() => this.table.setCurrentRow(p), 200);
    }

    private addGdsLayer(l: gds.GdsLayer): GdsLayer {
        const row = new GdsLayer(this, l, this.readOnly, this.keywords, this.table);
        this.children.push(row);
        return row;
    }
}
