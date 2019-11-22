import * as tree from '@/components/tree';
import {ElTable} from 'element-ui/types/table';
import Custom from '@/components/tree/custom';

export default class Customs implements tree.Node<void, void> {
    public readonly id: number = Math.random();
    public readonly k: string = 'Customs';
    public readonly children: Custom[] = [];

    constructor(customs: {[key: string]: any}, public readonly table: ElTable) {
        for (const k of Object.keys(customs)) {
            this.addCustom(k, customs[k]);
        }
    }

    // throw Error if array/map is invalid json format
    public toDomain(): {[key: string]: any} {
        const domain: {[key: string]: any} = {};
        tree.extractChildrenToMap(this, domain);
        return domain;
    }

    public add() {
        const p = this.addCustom('', '');
        setTimeout(() => this.table.setCurrentRow(p), 200);
    }

    private addCustom(k: string, v: string): Custom {
        const row = new Custom(this, k, v);
        this.children.push(row);
        return row;
    }


}
