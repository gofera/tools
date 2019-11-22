import * as tree from '@/components/tree';
import {ElTable} from 'element-ui/types/table';
import Gds from '@/components/case/gds';

// TODO: duplicate to Models, should refactory
export default class Gdses implements tree.Node<void, void> {
    public readonly id: number = Math.random();
    public readonly k: string = 'GDSes';
    public readonly children: Gds[] = [];

    constructor(gdsIDs: string[], private table: ElTable, private readOnly: boolean) {
        for (const id of gdsIDs) {
            this.addGds(id);
        }
    }

    public toDomain(): string[] {
        return this.children.map((it) => it.v.value);
    }

    public add() {
        const p = this.addGds('');
        setTimeout(() => this.table.setCurrentRow(p), 200);
    }

    private addGds(gdsID: string): Gds {
        const row = new Gds(this, gdsID, this.readOnly);
        this.children.push(row);
        return row;
    }
}
