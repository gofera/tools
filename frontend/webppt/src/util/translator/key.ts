import {translateTime, replaceAll} from '..';
import * as key from '../../api/key';

export const mp: {[key: string]: string} = {
    '${Product}': 'product',
    '${Name}': 'names',
    '${Category}': 'cat',
    '${Type}': 'type',
    '${Last Modified Time}': 'time',
};

export function translateSearch(input: string): string {
    input = translateTime(input);
    for (const k of Object.keys(mp)) {
        input = replaceAll(input, k, mp[k]);
    }
    for (const c of key.categories()) {
        input = replaceAll(input, '${' + key.fmtCategory(c) + '}', c.toString(10));
    }
    for (const t of key.valueTypes()) {
        input = replaceAll(input, '${' + key.fmtValueType(t) + '}', t.toString(10));
    }
    return input;
}
