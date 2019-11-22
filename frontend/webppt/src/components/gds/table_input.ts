import {ResTableInput} from '@/components/search';
import {ResourceTranslator} from '@/util/translator/resource';
import {GdsTranslator} from '@/util/translator/gds';
import * as api from '@/api';
import * as key from '@/api/key';
import * as gds from '@/api/gds';
import {GdsTreeEditorInput} from '@/components/gds/input';

export class GdsTableInput implements ResTableInput<gds.Gds, gds.GdsResp, gds.GdssResp> {
    public readonly treeInput = new GdsTreeEditorInput();
    private readonly translator = new GdsTranslator();
    public getSuggestionTranslater(): ResourceTranslator {
        return this.translator;
    }
    public getKeywords(): Promise<key.KeysResp> {
        return key.find({
            filter: `product='' and cat=${key.Category.Gds}`,
        });
    }
    public getNull(): gds.Gds {
        return gds.nullGds();
    }

    public remove(token: string, m: gds.Gds): Promise<api.Resp> {
        return gds.remove(token, m.ID);
    }

    public find(opt: api.FindOpt): Promise<gds.GdssResp> {
        return gds.find(opt);
    }

    public getResourcesFromResp(r: gds.GdssResp): gds.Gds[] {
        return r.Gdss;
    }

    public getCount(r: gds.GdssResp): number {
        return r.Total!;
    }
    public getTreeInput(): GdsTreeEditorInput {
        return this.treeInput;
    }

    public getTopic(): string {
        return 'GDS';
    }
}
