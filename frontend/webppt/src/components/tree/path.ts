import * as tree from '@/components/tree';
import * as api from '@/api';

export default class Path implements tree.Node<string, api.Location> {
    public readonly id: number = Math.random();
    public readonly k: tree.KV<string>;
    public readonly v: tree.KV<api.Location>;
    public isSelectedGenAttr: boolean = false;

    constructor(public readonly parent: tree.Node<any, any>, p: api.PathLoc) {
        this.k = {
            value: p.Path,
            editor: tree.KV_EDITOR_INPUT,
            placeholder: 'Input the path',
        };
        this.v = {
            value: p.Loc,
            editor: tree.KV_EDITOR_SELECT,
            options: [
                {label: 'Locate in Brion US', value: api.Location.LocBUS},
                {label: 'Locate in Brion China', value: api.Location.LocBC},
                {label: 'Others', value: api.Location.LocUndefined},
            ],
            fmt(): string {
                for (const o of this.options!) {
                    if (this.value === o.value) {
                        return o.label;
                    }
                }
                return '';
            },
        };
    }

    public del() {
        const i = this.parent.children!.indexOf(this);
        if (i >= 0) {
            this.parent.children!.splice(i, 1);
        }
    }

    public toDomain(): string {
        return api.toPath({
            Path: this.k.value,
            Loc: this.v.value,
        });
    }

    public canGenAttr(): boolean {
        return this.k.value !== '' && this.v.value !== api.Location.LocUndefined;
    }
}
