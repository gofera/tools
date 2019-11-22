import Paths from '@/components/tree/paths';
import Attrs from '@/components/tree/attrs';
import Customs from '@/components/tree/customs';
import * as res from '@/api/resource';
import * as key from '@/api/key';
import {ElTable} from 'element-ui/types/table';
import {Node} from '@/components/tree/index';
import StrKvNode from '@/components/tree/str_kv_node';
import UserAndTime from '@/components/tree/user_time';

export abstract class Tree<T extends res.Res> extends Array<Node<any, any>> {
    public readonly paths: Paths;
    public readonly attrs: Attrs;
    public readonly customs: Customs;
    public readonly md5: StrKvNode;
    public readonly id: StrKvNode;
    public readonly created: UserAndTime;
    public readonly comment: StrKvNode;

    // note: cannot be a method, or else caller cannot find the method
    public abstract toDomain: (origin: T) => T;
    public newAttrGenReq: () => res.AttrGenReq;
    public updateKeywords: (keywords: key.Key[]) => void;
    protected toBaseDomain: () => any;

    protected constructor(mod: T, keywords: key.Key[], treeTable: ElTable, private readOnly: boolean) {
        super();
        this.paths = new Paths(mod.Paths, treeTable);
        this.attrs = new Attrs(mod.Attrs, keywords, readOnly);
        this.customs = new Customs(mod.Customs, treeTable);
        this.md5 = new StrKvNode('MD5', mod.MD5);
        this.id = new StrKvNode('ID', mod.ID);
        this.created = new UserAndTime('Created', mod.Created);
        this.comment = new StrKvNode('Comment', mod.Comment, readOnly);

        this.newAttrGenReq = () => {
            return {
                Path: this.paths.currGenerateAttrPath!.toDomain(),
                UnlockedAttrs: this.attrs.getUnlockedAttrs(),
            };
        };
        this.toBaseDomain = () => ({
            Attrs: this.attrs.toDomain(),
            Customs: this.customs.toDomain(),
            Comment: this.comment.v.value,
        });
        this.updateKeywords = (keys: key.Key[]) => {
            // TODO: the logic is copy, it is better to copy instead assign, which if undefined in new velue cannot
            //  replace new value. Here cannot change the reference of this.attrs, or else tree editor cannot update.
            Object.assign(this.attrs, new Attrs(mod.Attrs, keys, false));
        };
    }
    protected init() {
        if (this.readOnly) {
            super.push(...this.getReadonlyList());
        } else {
            super.push(...this.getEditableList());
        }
    }

    protected getEditableList(): Array<Node<any, any>> {
        return [this.comment, this.paths, ...this.getEditableListBeforeAttrs(),
            this.attrs, this.customs, ...this.getEditableListAfterCustoms()];
    }
    protected getEditableListBeforeAttrs(): Array<Node<any, any>> {
        return [];
    }
    protected getEditableListAfterCustoms(): Array<Node<any, any>> {
        return [];
    }

    protected getReadonlyList(): Array<Node<any, any>> {
        return [this.comment, this.id, this.md5, this.created, ...this.getReadonlyListBeforeAttrs(),
            this.attrs, this.customs, ...this.getReadonlyListAfterCustoms()];
    }
    protected getReadonlyListBeforeAttrs(): Array<Node<any, any>> {
        return [];
    }
    protected getReadonlyListAfterCustoms(): Array<Node<any, any>> {
        return [];
    }
}
