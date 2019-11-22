import * as model from '@/api/model';
import * as key from '@/api/key';
import {ElTable} from 'element-ui/types/table';
import {Tree} from '@/components/tree/tree';

export default class ModelTree extends Tree<model.Model> {
    public static create(mod: model.Model, keywords: key.Key[], treeTable: ElTable, readonly: boolean): ModelTree {
        const t = new ModelTree(mod, keywords, treeTable, readonly);
        t.init();
        return t;
    }
    public toDomain: (origin: model.Model) => model.Model;
    protected constructor(mod: model.Model, keywords: key.Key[], treeTable: ElTable, readonly: boolean) {
        super(mod, keywords, treeTable, readonly);
        this.toDomain = (origin: model.Model) => {
            const paths = this.paths.toDomain();
            if (paths.length === 0) {
                throw new Error('Please specify at least one path for the model');
            }
            return Object.assign({}, origin, Object.assign(this.toBaseDomain(), {
                Paths: paths,
            }));
        };
    }
}
