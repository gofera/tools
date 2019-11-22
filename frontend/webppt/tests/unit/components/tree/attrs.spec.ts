import Attrs from '@/components/tree/attrs';
import Attribute from '@/components/tree/attr';
import * as key from '@/api/key';
import * as tree from '@/components/tree';
import AttrGroup from '@/components/tree/attr_group';

function newKey(...names: string[]): key.Key {
    const k = key.nullKey();
    k.Names = names;
    return k;
}

function newKeyWithID(id: string, ...names: string[]): key.Key {
    const k = key.nullKey();
    k.ID = id;
    k.Names = names;
    return k;
}

function fmtChildrenKey(c: tree.Node<any, any>): any {
    if (c instanceof Attribute) {
        const tn = c as tree.Node<any, any>;
        if (tn.children !== void 0) {
            return {[c.k.fmt!()]: tn.children.map(fmtChildrenKey)};
        } else {
            return c.k.fmt!();
        }
    } else if (c instanceof AttrGroup) {
        return {[c.k.fmt!()]: c.children!.map(fmtChildrenKey)};
    }
}

describe('attrs', () => {
    it('should create attrs with children of attr and group', () => {
        // keyword should be sorted by names[0] ascend
        const keywords: key.Key[] = [
            newKey('aaa'), // a simple attribute with only one name without group
            newKey('aab', 'zzz'), // two names aab, zzz should show as 'aab, zzz'
            newKey('ab.cd'), // ab should be created as a group
            newKey('ab.ef'), // as the group ab exist, should not be created
            newKey('ab.ef.gh'), // not only group, attribute ab.ef can also has children
            newKey('ab.ef.ij.kl'), // as the attr ef exist, should be created, and it can have sub folder
            newKey('ab.mn.op.rs'), // should created group 'mn' and 'op'
            newKey('ab.mn.tu'), // should not created group 'mn' as exist
            newKey('ac.bd.ce', 'ac.bd.gh', 'ac.bd.ij'),
            newKey('ac.bdA'),
            newKey('ad'),
        ];
        const attrs = new Attrs({}, keywords, false);
        expect(attrs.children.map(fmtChildrenKey)).toEqual([
            'aaa',
            'aab, zzz',
            {
                ab: ['cd',
                    {
                        ef: ['gh',
                            {
                                ij: ['kl'],
                            },
                        ],
                    },
                    {
                        mn: [{
                            op: ['rs'],
                        },
                            'tu',
                        ],
                    },
                ],
            },
            {
                ac: [{
                    bd: ['ce, gh, ij'],
                },
                    'bdA',
                ],
            },
            'ad',
        ]);
    });
    it('should not show in readonly view mode', () => {
        // keyword should be sorted by names[0] ascend
        const keywords: key.Key[] = [
            newKey('aaa'), // a simple attribute with only one name without group
            newKey('aab', 'zzz'), // two names aab, zzz should show as 'aab, zzz'
            newKey('ab.cd'), // ab should be created as a group
            newKey('ab.ef'), // as the group ab exist, should not be created
            newKey('ab.ef.gh'), // not only group, attribute ab.ef can also has children
            newKey('ab.ef.ij.kl'), // as the attr ef exist, should be created, and it can have sub folder
            newKey('ab.mn.op.rs'), // should created group 'mn' and 'op'
            newKey('ab.mn.tu'), // should not created group 'mn' as exist
            newKey('ac.bd.ce', 'ac.bd.gh', 'ac.bd.ij'),
            newKey('ac.bdA'),
            newKey('ad'),
        ];
        const attrs = new Attrs({}, keywords, true);
        expect(attrs.children.map(fmtChildrenKey)).toEqual([]);
    });
    it('to domain should go through all attribute directly or deep indirectly inside group', () => {
        const keywords: key.Key[] = [
            newKeyWithID('k1', 'aaa'), // a simple attribute with only one name without group
            newKeyWithID('k2', 'aab', 'zzz'), // two names aab, zzz should show as 'aab, zzz'
            newKeyWithID('k3', 'ab.cd'), // ab should be created as a group
            newKeyWithID('k4', 'ab.ef'), // as the group ab exist, should not be created
            newKeyWithID('k5', 'ab.ef.gh'), // not only group, attribute ab.ef can also has children
            newKeyWithID('k6', 'ab.ef.ij.kl'), // as the attr ef exist, should be created, and it can have sub folder
            newKeyWithID('k7', 'ab.mn.op.rs'), // should created group 'mn' and 'op'
            newKeyWithID('k8', 'ab.mn.tu'), // should not created group 'mn' as exist
            newKeyWithID('k9', 'ac.bd.ce', 'ac.bd.gh', 'ac.bd.ij'),
            newKeyWithID('k10', 'ac.bdA'),
            newKeyWithID('k11', 'ad'),
        ];
        const attrs = new Attrs({
            k2: 12,
            k6: 34,
            k7: 77,
            k9: 56,
        }, keywords, false);
        expect(attrs.children.length).toBe(5);
        const c0 = attrs.children[0];
        expect(c0 instanceof Attribute).toBeTruthy();
        if (c0 instanceof Attribute) {
            c0.v.value = 0.5;
        }
        const c1 = attrs.children[1];
        expect(c1 instanceof Attribute).toBeTruthy();
        if (c1 instanceof Attribute) {
            c1.v.value = '"xy"';
        }
        const c21 = (attrs.children[2] as AttrGroup).children[1];
        expect(c21 instanceof Attribute).toBeTruthy();
        if (c21 instanceof Attribute) {
            c21.v.value = 21;
        }
        const c211 = ((c21 as tree.Node<any, any>).children![1] as AttrGroup).children[0];
        expect(c211 instanceof Attribute).toBeTruthy();
        if (c211 instanceof Attribute) {
            c211.v.value = 211;
        }
        expect(attrs.toDomain()).toEqual({
            k1: 0.5,
            k2: 'xy',
            k4: 21,
            k6: 211,
            k7: 77,
            k9: 56,
        });
    });
});
