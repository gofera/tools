import * as tree from '@/components/tree';
import * as key from '@/api/key';
import Attribute from '@/components/tree/attr';
import AttrGroup from '@/components/tree/attr_group';

export function fmtKey(k: string|tree.KV<string|key.Key>): string {
    if (typeof(k) === 'string') {
        return k;
    } else {
        const kv = k.value;
        if (typeof(kv) === 'string') {
            return kv;
        } else {
            return kv.Names[0];
        }
    }
}

export default class Attrs implements tree.Node<void, void> {
    public readonly id: number = Math.random();
    public readonly k: string = 'Attributes';
    public children: Array<Attribute|AttrGroup> = [];
    public locked?: boolean = true;
    // keyword should be sorted by names[0] ascend
    constructor(attrs: {[key: string]: any}, keywords: key.Key[], readonly: boolean) {
        let groupStack: Array<tree.Node<string|key.Key, any>> = [];
        let top: tree.Node<any, any> = this;
        for (const kw of keywords) {
            if (readonly && attrs[kw.ID] === void 0) {
                continue;
            }
            const name = kw.Names[0];
            const i = name.lastIndexOf('.');
            if (i < 0) {
                if (groupStack.length > 0) {
                    groupStack = [];
                    top = this;
                }
            } else {
                const groupPath = name.substring(0, i);
                let k = '';
                while (groupStack.length > 0) {
                    k = fmtKey(top.k);
                    if (groupPath === k || groupPath.startsWith(k + '.')) {
                        break;
                    } else {
                        groupStack.pop();
                        if (groupStack.length > 0) {
                            top = groupStack[groupStack.length - 1];
                        } else {
                            top = this;
                        }
                    }
                }
                if (groupPath !== k) {
                    let j = 0;
                    if (groupStack.length === 0) {
                        j = 0;
                    } else if (k !== '' && groupPath.startsWith(k + '.')) {
                        j = k.length + 1;  // + 1 for skip '.' after it
                    }
                    do {
                        j = groupPath.indexOf('.', j);
                        if (j < 0) {
                            j = i;
                        }
                        const grp = new AttrGroup(groupPath.substring(0, j));
                        if (top.children === void 0) {
                            top.children = [];
                        }
                        groupStack.push(grp);
                        top.children.push(grp);
                        top = grp;
                        j++;
                    } while (j < i);
                }
            }
            const attr = new Attribute(kw, attrs[kw.ID]);
            if (top.children === void 0) {
                top.children = [];
            }
            top.children.push(attr);
            groupStack.push(attr);
            top = attr;
        }
    }

    // throw Error if array/map is invalid json format
    public toDomain(): {[key: string]: any} {
        const domain: {[key: string]: any} = {};
        tree.extractChildrenToMap(this, domain);
        return domain;
    }

    public setLock(): void {
        const lock = this.getLock();
        if (lock === void 0) {
            return;
        }
        if (lock === null) {
            this.locked = false;
        }
        for (const child of this.children) {
            child.setLock(!this.locked);
        }
        this.locked = !this.locked;
    }

    public getLock(): boolean|undefined|null {
        let res: boolean|undefined = void 0;
        for (const child of this.children) {
            const childLock = child.getLock();
            if (childLock === null) {
                return null;
            }
            if (res === void 0) {
                res = childLock;
                continue;
            }
            if (childLock !== void 0 && res !== childLock) {
                return null;
            }
        }
        this.locked = res;
        return res;
    }

    public getUnlockedAttrs(): string[] {
        const res: string[] = [];
        for (const child of this.children) {
            res.push(...child.getUnlockedAttrs());
        }
        return res;
    }
}
