import * as tree from '@/components/tree';
import * as key from '@/api/key';
import * as gds from '@/api/gds';
import {ElTable} from 'element-ui/types/table';
import GdsTree from '@/components/gds/tree';

export class GdsTreeEditorInput implements tree.TreeEditorInput<gds.Gds, gds.GdsResp> {
    public gdsLayerKeys: key.Key[] = [];
    public createTree(origin: gds.Gds, gdsKeys: key.Key[], treeTable: ElTable,
                      readonly: boolean): GdsTree {
        return GdsTree.create(origin, treeTable, readonly, gdsKeys, this.gdsLayerKeys);
    }

    public upsert(token: string, origin: gds.Gds, t: GdsTree, toGenAttr: boolean): Promise<gds.GdsResp> {
        const req: gds.GdsReq = t.toDomain(origin);
        if (toGenAttr) {
            req.AttrGen = t.newAttrGenReq();
        }
        return gds.upsert(token, req);
    }

    public getRespData(r: gds.GdsResp): gds.Gds {
        return r.Gds;
    }
}
