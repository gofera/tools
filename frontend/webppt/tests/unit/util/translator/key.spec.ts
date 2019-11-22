import * as key from '@/util/translator/key';

describe('key', () => {
    it('#translateSearch', () => {
        interface TestData {
            in: string;
            out: string;
        }
        const tds: TestData[] = [
            {in: '${Product}="OPC"', out: 'product="OPC"'},
            {in: '${Name}="OPC" or ${Name} like "LMC.*"', out: 'names="OPC" or names like "LMC.*"'},
            {in: '${Category} = ${GDS} or ${Category}=${GDS Layer} and ${Category} != ${Model} or ${Category}!=${Test Case}',
                out: 'cat = 0 or cat=1 and cat != 2 or cat!=3'},
            {in: ' ${Type} = ${Undefined} or ${Type} = ${Boolean} or ${Type}=${Integer} or ${Type} = ${Float} and ${Type}=${String} or ${Type}=${Map} and ${Type}=${Array} ',
                out: ' type = 0 or type = 2 or type=3 or type = 4 and type=1 or type=6 and type=5 '},
            {in: '${Last Modified Time} >= ${2019-10-11 14:19:32}', out: 'time >= 1570774772000000000'},
            {in: '${Last Modified Time} >= ${2019-10-11 14:19:42} and ${Last Modified Time}<${2019-10-11 14:39:05}',
                out: 'time >= 1570774782000000000 and time<1570775945000000000'},
        ];
        for (const td of tds) {
            const r = key.translateSearch(td.in);
            expect(r).toEqual(td.out);
        }
    });
});
