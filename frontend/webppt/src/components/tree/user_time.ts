import * as tree from '@/components/tree/index';
import * as api from '@/api';
import StrKvNode from '@/components/tree/str_kv_node';

export default class UserAndTime implements tree.Node<void, void> {
    public readonly id: number = Math.random();
    public readonly children: Array<tree.Node<void, string>> = [];

    constructor(public readonly k: string, ut: api.UserAndTime) {
        this.children.push(new StrKvNode('User', ut.User));
        this.children.push(new StrKvNode('Time', api.formatTime(ut.Time)));
    }
}
