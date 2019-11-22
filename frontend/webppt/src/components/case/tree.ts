import * as tc from '@/api/case';
import {Tree} from '@/components/tree/tree';
import * as key from '@/api/key';
import * as product from '@/api/product';
import {ElTable} from 'element-ui/types/table';
import Product from '@/components/case/product';
import {Node} from '@/components/tree';
import NumberKvNode from '@/components/tree/number_kv_node';
import StrKvNode from '@/components/tree/str_kv_node';
import Gdses from '@/components/case/gdses';
import Models from '@/components/case/models';
import QTest from '@/components/case/qtest';

export default class CaseTree extends Tree<tc.Case> {
    public static create(c: tc.Case, keywords: key.Key[], treeTable: ElTable, readonly: boolean,
                         products: product.Product[]): CaseTree {
        const t = new CaseTree(c, keywords, treeTable, readonly, products);
        t.init();
        return t;
    }
    public toDomain: (origin: tc.Case) => tc.Case;
    public readonly product: Product;
    public readonly name: StrKvNode;
    public readonly priority: NumberKvNode;
    public readonly qTest: QTest;
    public readonly gdses: Gdses;
    public readonly models: Models;
    protected constructor(c: tc.Case, keywords: key.Key[], treeTable: ElTable, readonly: boolean,
                          products: product.Product[]) {
        super(c, keywords.filter((k) => k.Product === c.Product), treeTable, readonly);
        this.product = new Product(c.Product, products);
        this.name = new StrKvNode('Name', c.Name, readonly);
        this.priority = new NumberKvNode('Priority (Sensitivity)', c.Priority, readonly);
        this.qTest = new QTest(c.QTest, readonly);
        this.gdses = new Gdses(c.Gdses, treeTable, readonly);
        this.models = new Models(c.Models, treeTable, readonly);

        this.toDomain = (origin: tc.Case) => {
            const paths = this.paths.toDomain();
            if (paths.length === 0) {
                throw new Error('Please specify at least one path for the test case');
            }
            return Object.assign({}, origin, Object.assign(this.toBaseDomain(), {
                Paths: paths,
                Product: this.product.v.value,
                Name: this.name.v.value,
                Priority: this.priority.v.value,
                QTest: this.qTest.toDomain(),
                Gdses: this.gdses.toDomain(),
                Models: this.models.toDomain(),
            }));
        };
    }
    protected getEditableListBeforeAttrs(): Array<Node<any, any>> {
        return [this.product, this.name, this.priority, this.qTest, this.gdses, this.models];
    }
    protected getReadonlyListBeforeAttrs(): Array<Node<any, any>> {
        return [this.qTest, this.gdses, this.models];
    }
}
