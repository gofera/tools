import {ResTableInput} from '@/components/search';
import {ResourceTranslator} from '@/util/translator/resource';
import {CaseTranslator} from '@/util/translator/case';
import * as api from '@/api';
import * as key from '@/api/key';
import * as tc from '@/api/case';
import {CaseTreeEditorInput} from '@/components/case/input';

export class CaseTableInput implements ResTableInput<tc.Case, tc.CaseResp, tc.CasesResp> {
    public readonly treeInput = new CaseTreeEditorInput();
    private translator = new CaseTranslator();
    public getSuggestionTranslater(): ResourceTranslator {
        return this.translator;
    }
    public getKeywords(): Promise<key.KeysResp> {
        return key.find({
            filter: `cat=${key.Category.TestCase}`,
        });
    }
    public getNull(): tc.Case {
        return tc.nullCase();
    }

    public remove(token: string, m: tc.Case): Promise<api.Resp> {
        return tc.remove(token, m.ID);
    }

    public find(opt: api.FindOpt): Promise<tc.CasesResp> {
        return tc.find(opt);
    }

    public getResourcesFromResp(r: tc.CasesResp): tc.Case[] {
        return r.Cases;
    }

    public getCount(r: tc.CasesResp): number {
        return r.Total!;
    }
    public getTreeInput(): CaseTreeEditorInput {
        return this.treeInput;
    }

    public getTopic(): string {
        return 'Test Case';
    }
}
