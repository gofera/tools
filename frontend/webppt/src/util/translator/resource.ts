import * as ut from '@/util';
import * as api from '@/api';

export class ResourceTranslator {
    private readonly mp: {[key: string]: string} = {
        '${ID}': '_id',
        '${Path}': 'paths',
        '${Created Time}': 'created.time',
        '${Created User}': 'created.user',
        '${Last Modified Time}': 'lastmodified.time',
        '${Last Modified User}': 'lastmodified.user',
        '${Status is OK}': `(status = ${api.Status.DONE})`,
        '${Status is Pending}': `(status = ${api.Status.PENDING})`,
        '${Status is Error}': `(status > ${api.Status.PENDING})`,
        '${Error}': 'err',
        '${Comment}': 'comment',
        '${MD5}': 'md5',
        '${Custom}': 'customs',
        '${Custom}.xxx': 'customs.xxx',
    };

    public getMapping(): {[key: string]: string} {
        return this.mp;
    }

    public translateSearch(input: string): string {
        input = ut.translateTime(input);
        input = ut.translateAttribute(input);
        const mp = this.getMapping();
        for (const k of Object.keys(mp)) {
            input = ut.replaceAll(input, k, mp[k]);
        }
        return input;
    }
}
