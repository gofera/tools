import Path from '@/components/tree/path';
import * as tree from '@/components/tree';
import * as api from '@/api';
import {ElTable} from 'element-ui/types/table';

export default class Paths implements tree.Node<void, void> {
    public readonly id: number = Math.random();
    public readonly k: string = 'Paths';
    public readonly children: Path[] = [];
    public currGenerateAttrPath?: Path = void 0;

    constructor(paths: string[], private table: ElTable) {
        for (const p of paths) {
            this.addPath(api.toPathLoc(p));
        }
    }

    public toDomain(): string[] {
        return this.children.map((it) => it.toDomain());
    }

    public handleGenAttrChange(path: Path): void {
        if (this.currGenerateAttrPath === path) {
            path.isSelectedGenAttr = false;
            this.currGenerateAttrPath = void 0;
            return;
        }
        if (this.currGenerateAttrPath !== void 0) {
            this.currGenerateAttrPath.isSelectedGenAttr = false;
        }
        path.isSelectedGenAttr = true;
        this.currGenerateAttrPath = path;
    }

    public add() {
        const p = this.addPath(api.nullPathLoc());
        if (this.children.length === 1) {
            // for the first path of add, auto select to gen attr
            this.handleGenAttrChange(p);
        }
        setTimeout(() => this.table.setCurrentRow(p), 200);
    }

    private addPath(p: api.PathLoc): Path {
        const row = new Path(this, p);
        this.children.push(row);
        return row;
    }
}
