import * as tree from '@/components/tree';
import * as product from '@/api/product';

export default class Product implements tree.Node<string, string> {
    public readonly id: number = Math.random();
    public readonly k = 'Product';
    public readonly v: tree.KV<string>;

    constructor(prod: string, products: product.Product[]) {
        const options = [{
            label: 'Shared',
            value: '',
        }, ...products.map((it) => it.Name).map((name) => ({
            label: name,
            value: name,
        }))];
        this.v = {
            value: prod,
            editor: tree.KV_EDITOR_SELECT,
            options,
        };
    }
}
