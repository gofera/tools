import * as tree from '@/components/tree';
import * as key from '@/api/key';
import * as model from '@/api/model';
import {ElTable} from 'element-ui/types/table';
import ModelTree from '@/components/model/tree';

export class ModelTreeEditorInput implements tree.TreeEditorInput<model.Model, model.ModelResp> {
    public createTree(origin: model.Model, keywords: key.Key[], treeTable: ElTable,
                      readonly: boolean): ModelTree {
        return ModelTree.create(origin, keywords, treeTable, readonly);
    }

    public upsert(token: string, origin: model.Model, t: ModelTree, toGenAttr: boolean): Promise<model.ModelResp> {
        const req: model.ModelReq = t.toDomain(origin);
        if (toGenAttr) {
            req.AttrGen = t.newAttrGenReq();
        }
        return model.upsert(token, req);
    }

    public getRespData(r: model.ModelResp): model.Model {
        return r.Model;
    }
}
