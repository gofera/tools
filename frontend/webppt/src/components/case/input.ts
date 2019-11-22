import * as tree from '@/components/tree';
import * as key from '@/api/key';
import * as tc from '@/api/case';
import * as product from '@/api/product';
import {ElTable} from 'element-ui/types/table';
import CaseTree from '@/components/case/tree';

export class CaseTreeEditorInput implements tree.TreeEditorInput<tc.Case, tc.CaseResp> {
    public products: product.Product[] = [];
    public createTree(origin: tc.Case, keywords: key.Key[], treeTable: ElTable,
                      readonly: boolean): CaseTree {
        return CaseTree.create(origin, keywords, treeTable, readonly, this.products);
    }

    public upsert(token: string, origin: tc.Case, t: CaseTree, toGenAttr: boolean): Promise<tc.CaseResp> {
        const req: tc.CaseReq = t.toDomain(origin);
        if (toGenAttr) {
            req.AttrGen = t.newAttrGenReq();
        }
        return tc.upsert(token, req);
    }

    public getRespData(r: tc.CaseResp): tc.Case {
        return r.Case;
    }
}
