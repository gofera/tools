import {ResourceTranslator} from '@/util/translator/resource';

describe('ResourceTranslator', () => {
    it('#translateSearch', () => {
        interface TestData {
            in: string;
            out: string;
        }
        const tds: TestData[] = [
            {in: ' ${ID}= "5daffebf8b8c589e49c9907a" ', out: ' _id= "5daffebf8b8c589e49c9907a" '},
            {
                in: '${Path}="/h/user/you/model/1" OR ${Path} like "/h/user/you/gds/.*"',
                out: 'paths="/h/user/you/model/1" OR paths like "/h/user/you/gds/.*"',
            },
            {in: '${2019-10-24 09:50:24} > ${2019-10-23 15:18:23}', out: '1571881824000000000 > 1571815103000000000'},
            {in: '${Created Time} > ${2019-10-24 09:50:24}', out: 'created.time > 1571881824000000000'},
            {in: '${Created User} = "weliu"', out: 'created.user = "weliu"'},
            {in: '${Last Modified Time} > ${2019-10-24 09:50:24}', out: 'lastmodified.time > 1571881824000000000'},
            {in: '${Last Modified User} = \'weliu\'', out: `lastmodified.user = 'weliu'`},
            {in: '${Attribute.gfga} = "6erere3"', out: `attrs.gfga = "6erere3"`},
            {in: '${Attribute.g.b.c }= 2 or ${Attribute.xx.yy} = 3', out: `attrs.g.b.c= 2 or attrs.xx.yy = 3`},
            {in: '${Custom.g.b.c }= 2 or ${Custom.xx.yy} = 3', out: `customs.g.b.c= 2 or customs.xx.yy = 3`},
            {in: '${Status}= ${Status Pending} or ${Status} =${Status OK}', out: `status= 1 or status =0`},
        ];
        const t = new ResourceTranslator();
        for (const td of tds) {
            const r = t.translateSearch(td.in);
            expect(r).toEqual(td.out);
        }
    });
});
