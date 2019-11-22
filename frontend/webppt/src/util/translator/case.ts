import {ResourceTranslator} from '@/util/translator/resource';
import * as util from '@/util';
import {ModelTranslator} from '@/util/translator/model';
import {GdsTranslator} from '@/util/translator/gds';

export class CaseTranslator extends ResourceTranslator {

    private mapping?: {[key: string]: string};

    public getMapping(): {[key: string]: string} {
        if (this.mapping === void 0) {
            this.mapping = Object.assign({}, super.getMapping(), {
                '${Product}': 'product',
                '${Name}': 'name',
                '${QTest.Name}': 'qtest.name',
                '${QTest.URL}': 'qtest.url',
                '${Priority}': 'priority',
            });
            this.addModelMapping();
            this.addGdsMapping();
        }
        return this.mapping;
    }

    public translateSearch(input: string): string {
        input = super.translateSearch(input);
        // translate Gds and Model for search
        input = util.translateGdsLayerAttr(input);
        input = util.translateGdsAttr(input);
        input = util.translateModelAttr(input);
        return input;
    }

    private addModelMapping(): void {
        this.addMapping(new ModelTranslator().getMapping(), 'Model.', 'model.');
    }

    private addGdsMapping(): void {
        this.addMapping(new GdsTranslator().getMapping(), 'GDS.', 'gds.');
    }

    private addMapping(mp: {[key: string]: string}, keyPrefix: string, valuePrefix: string): void {
        for (let [k, v] of Object.entries(mp)) {
            k = k.replace('${', '${' + keyPrefix);
            if (v.length > 1 && v[0] === '(') {
                v = '(' + valuePrefix + v.substring(1);
            } else {
                v = valuePrefix + v;
            }
            Object.assign(this.mapping, {[k]: v});
        }
    }
}
