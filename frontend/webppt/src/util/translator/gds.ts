import {ResourceTranslator} from '@/util/translator/resource';
import * as util from '@/util';

export class GdsTranslator extends ResourceTranslator {
    private mapping?: {[key: string]: string};

    public getMapping(): {[key: string]: string} {
        if (this.mapping === void 0) {
            this.mapping = Object.assign({}, super.getMapping(), {
                '${Lambda.ID}': 'lambda.id',
                '${Lambda.Path}': 'lambda.path',
                '${Layer.Name}': 'layers.name',
                '${Layer.Preview}': 'layers.previews',
                '${Layer.Custom}': 'layers.customs',
                '${Layer.Custom}.xxx': 'layers.customs.xxx',
            });
        }
        return this.mapping;
    }

    public translateSearch(input: string): string {
        input = super.translateSearch(input);
        input = util.translateLayerAttr(input);
        return input;
    }
}
