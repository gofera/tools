import * as tree from '@/components/tree';
import * as tc from '@/api/case';
import StrKvNode from '@/components/tree/str_kv_node';

export default class QTest implements tree.Node<void, string> {
    public readonly id: number = Math.random();
    public readonly k: string = 'QTest';
    public readonly children?: StrKvNode[];
    public readonly v: tree.KV<string>;

    constructor(qTest: tc.QTest, private readOnly: boolean) {
        if (readOnly) {
            this.v = {
                value: qTest.Name,
                url: qTest.Url,
                tooltip: qTest.Url,
            };
        } else {
            this.v = {
                value: qTest.Name,
                editor: tree.KV_EDITOR_INPUT,
            };
            this.children = [new StrKvNode('URL', qTest.Url, false)];
        }
    }

    public toDomain(): tc.QTest {
        return {
            Name: this.v.value,
            Url: this.children![0].v.value,
        };
    }
}
