import * as tree from '@/components/tree';
import * as gds from '@/api/gds';
import {ElTable} from 'element-ui/types/table';
import Lambda from '@/components/gds/lambda';

export default class Lambdas implements tree.Node<void, void> {
    public readonly id: number = Math.random();
    public readonly k: string = 'Lambdas';
    public readonly children: Lambda[] = [];

    constructor(lambdas: gds.Lambda[], private table: ElTable, private readOnly: boolean) {
        for (const l of lambdas) {
            this.addLambda(l);
        }
    }

    public toDomain(): gds.Lambda[] {
        return this.children.map((it) => it.toDomain());
    }

    public add() {
        const p = this.addLambda(gds.nullLambda());
        setTimeout(() => this.table.setCurrentRow(p), 200);
    }

    private addLambda(l: gds.Lambda): Lambda {
        const row = new Lambda(this, l, this.readOnly);
        this.children.push(row);
        return row;
    }
}
