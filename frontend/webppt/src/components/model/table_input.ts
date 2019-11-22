import {ResTableInput} from '@/components/search';
import {ResourceTranslator} from '@/util/translator/resource';
import {ModelTranslator} from '@/util/translator/model';
import * as api from '@/api';
import * as key from '@/api/key';
import * as model from '@/api/model';
import {ModelTreeEditorInput} from '@/components/model/input';

export class ModelTableInput implements ResTableInput<model.Model, model.ModelResp, model.ModelsResp> {
    private translator = new ModelTranslator();
    private treeInput = new ModelTreeEditorInput();
    public getSuggestionTranslater(): ResourceTranslator {
        return this.translator;
    }
    public getKeywords(): Promise<key.KeysResp> {
        return key.find({
            filter: `product='' and cat=${key.Category.Model}`,
        });
    }
    public getNull(): model.Model {
        return model.nullModel();
    }

    public remove(token: string, m: model.Model): Promise<api.Resp> {
        return model.remove(token, m.ID);
    }

    public find(opt: api.FindOpt): Promise<model.ModelsResp> {
        return model.find(opt);
    }

    public getResourcesFromResp(r: model.ModelsResp): model.Model[] {
        return r.Models;
    }

    public getCount(r: model.ModelsResp): number {
        return r.Total!;
    }
    public getTreeInput(): ModelTreeEditorInput {
        return this.treeInput;
    }

    public getTopic(): string {
        return 'Model';
    }
}
