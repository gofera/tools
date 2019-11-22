import * as util from '@/util';
import * as api from '@/api';

describe('util', () => {
    it('#insertTip', () => {
        let res = util.insertTip('${Pr} na', '${Name}', 8, 8);
        expect(res.text).toEqual('${Pr} ${Name}');
        expect(res.end).toEqual(6);

        res = util.insertTip('', '${Name}', 0, 0);
        expect(res.text).toEqual('${Name}');
        expect(res.end).toEqual(0);

        res = util.insertTip('${Pr} na ${Type}', '${Name}', 8, 8);
        expect(res.text).toEqual('${Pr} ${Name} ${Type}');
        expect(res.end).toEqual(6);

        res = util.insertTip('${Pr} na ${Type}=1', '${Name}', 8, 16);
        expect(res.text).toEqual('${Pr} ${Name}=1');
        expect(res.end).toEqual(14);
    });

    it('#replaceAll', () => {
        interface TestData {
            str: string;
            old: string;
            newStr: string;
            expected: string;
        }
        const tds: TestData[] = [
            {str: 'id != 1 &&id!=2', old: 'id', newStr: 'ID', expected: 'ID != 1 &&ID!=2'},
            {str: '${Name} != "OPC" and ${Name} like "SMO.*"', old: '${Name}', newStr: 'names',
                expected: 'names != "OPC" and names like "SMO.*"'},
            {str: '${*. !~^#} != "OPC" and ${*. !~^#} like ${*. !~^#} ', old: '${*. !~^#}', newStr: '#.*',
                expected: '#.* != "OPC" and #.* like #.* '},
            {str: ' ', old: '.*', newStr: 'x', expected: ' '},
            {str: '', old: ' ', newStr: ' ', expected: ''},
        ];
        for (const td of tds) {
            const r = util.replaceAll(td.str, td.old, td.newStr);
            expect(r).toEqual(td.expected);
        }
    });

    it('#encodeFindOpt', () => {
        interface TestData {
            findOpt: api.FindOpt;
            afterEncoded: string;
            exclude?: string[];
        }

        const tds: TestData[] = [
            {findOpt: {filter: 'product = \'OPC\'', limit: 1},
                afterEncoded: 'filter=product%20%3D%20%27OPC%27&limit=1'},
            {findOpt: {filter: 'product=\'OPC\'', limit: 1},
                afterEncoded: 'filter=product%3D%27OPC%27&limit=1'},
            {findOpt: {filter: 'product=\'OPC\'', limit: 1, returntotal: true},
                afterEncoded: 'filter=product%3D%27OPC%27&limit=1',
                exclude: ['returntotal']},
            {findOpt: {filter: 'product=\'OPC\'', limit: 1, returntotal: true},
                afterEncoded: 'filter=product%3D%27OPC%27',
                exclude: ['returntotal', 'limit']},
            {findOpt: {filter: 'product=\'OPC\'', limit: 1, returntotal: true},
                afterEncoded: 'filter=product%3D%27OPC%27&limit=1&returntotal=true'},
        ];

        for (const td of tds) {
            const r = util.serialize(td.findOpt, undefined, td.exclude);
            expect(r).toEqual(td.afterEncoded);
        }
    });
});
