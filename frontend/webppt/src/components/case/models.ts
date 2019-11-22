import * as tree from '@/components/tree';
import {ElTable} from 'element-ui/types/table';
import Model from '@/components/case/model';

export default class Models implements tree.Node<void, void> {
    public readonly id: number = Math.random();
    public readonly k: string = 'Models';
    public readonly children: Model[] = [];

    constructor(modelIDs: string[], private table: ElTable, private readOnly: boolean) {
        for (const id of modelIDs) {
            this.addModel(id);
        }
    }

    public toDomain(): string[] {
        return this.children.map((it) => it.v.value);
    }

    public add() {
        const p = this.addModel('');
        setTimeout(() => this.table.setCurrentRow(p), 200);
    }

    private addModel(modelID: string): Model {
        const row = new Model(this, modelID, this.readOnly);
        this.children.push(row);
        return row;
    }
}
