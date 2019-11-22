import moment from 'moment';

export interface TextAndEnd {
    text: string;
    end: number;
}

export function insertTip(text: string, tip: string, start: number, end: number): TextAndEnd {
    let newEnd = end;
    while (start > 0 && text[start - 1] !== ' ') {
        start--;
        newEnd--;
    }
    return {
        text: text.substring(0, start) + tip + text.substring(end),
        end: newEnd,
    };
}

export function replaceAll(str: string, old: string, newStr: string): string {
    return str.split(old).join(newStr);
}

const timeRegex = /\$\{(\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2})\}/;

export function translateTime(input: string): string {
    let regexArray = timeRegex.exec(input);
    while (regexArray != null) {
        const m = moment(regexArray[1], 'YYYY-MM-DD HH:mm:ss');
        const unixTimeNs = m.unix().toString(10) + '000000000';
        input = input.replace(regexArray[0], unixTimeNs);
        regexArray = timeRegex.exec(input);
    }
    return input;
}

function translateAttr(regex: RegExp, prefix: string): (_: string) => string {
    return (input: string) => {
        let regexArray = regex.exec(input);
        while (regexArray != null) {
            input = input.replace(regexArray[0], `${prefix}.${regexArray[1].trim()}`);
            regexArray = regex.exec(input);
        }
        return input;
    };
}

export const translateAttribute = translateAttr(/\$\{Attribute\.(.+?)\}/, 'attrs');
export const translateLayerAttr = translateAttr(/\$\{Layer\.Attribute\.(.+?)\}/, 'layers.attrs');
export const translateGdsAttr = translateAttr(/\$\{GDS\.Attribute\.(.+?)\}/, 'gds.attrs');
export const translateGdsLayerAttr = translateAttr(/\$\{GDS\.Layer\.Attribute\.(.+?)\}/, 'gds.layers.attrs');
export const translateModelAttr = translateAttr(/\$\{Model\.Attribute\.(.+?)\}/, 'model.attrs');

export interface EditedRow<T> {
    row?: T;
}

export function serialize(obj: any, prefix?: string, exclude?: string[]): string {
    const str = [];
    for (const p in obj) {
        if (obj.hasOwnProperty(p)) {
            const k = prefix ? prefix + '[' + p + ']' : p;
            const v = obj[p];
            if (v !== undefined) {
                if (v !== null && typeof v === 'object') {
                        str.push(serialize(v, k, exclude));
                } else {
                    if (exclude !== undefined && exclude.includes(k)) {
                        continue;
                    }
                    str.push(encodeURLParam(k) + '=' + encodeURLParam(v));
                }
            }
        }
    }
    return str.join('&');
}

function encodeURLParam(param: string): string {
    return encodeURIComponent(param).replace(/'/g, '%27').
    replace(/!/g, '%21');
}
