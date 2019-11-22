import * as tree from '@/components/tree';
import Attribute from '@/components/tree/attr';

export default class AttrGroup implements tree.Node<string, void> {
    public readonly id: number = Math.random();
    public readonly k: tree.KV<string>;
    public children: Array<Attribute|AttrGroup> = [];
    public locked?: boolean = true;
    constructor(k: string) {
        this.k = {
            value: k,
            tooltip: k,
            fmt(): string {
                const i = this.value.lastIndexOf('.');
                if (i < 0) {
                    return this.value;
                } else {
                    return this.value.substring(i + 1);
                }
            },
        };
    }

    public setLock(lock?: boolean): void {
        if (lock !== void 0) {
            for (const child of this.children) {
                child.setLock(lock);
            }
        } else {
            const currLock = this.getLock();
            if (currLock === void 0) {
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
    }

    public getLock(): boolean|undefined|null {
        let res: boolean|undefined = void 0;
        for (const child of this.children) {
            const childLock = child.getLock();
            // null represent indeterminate
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
