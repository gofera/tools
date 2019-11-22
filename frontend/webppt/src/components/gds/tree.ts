import * as gds from '@/api/gds';
import {Tree} from '@/components/tree/tree';
import * as key from '@/api/key';
import {ElTable} from 'element-ui/types/table';
import {Node} from '@/components/tree';
import Lambdas from '@/components/gds/lambdas';
import GdsLayers from '@/components/gds/layers';

export default class GdsTree extends Tree<gds.Gds> {
    public static create(g: gds.Gds, treeTable: ElTable, readonly: boolean,
                         gdsKeys: key.Key[], gdsLayerKeys: key.Key[]): GdsTree {
        const t = new GdsTree(g, treeTable, readonly, gdsKeys, gdsLayerKeys);
        t.init();
        return t;
    }
    public toDomain: (origin: gds.Gds) => gds.Gds;
    public readonly lambdas: Lambdas;
    public readonly gdsLayers: GdsLayers;
    protected constructor(mod: gds.Gds, treeTable: ElTable, readonly: boolean,
                          gdsKeys: key.Key[], gdsLayerKeys: key.Key[]) {
        super(mod, gdsKeys, treeTable, readonly);
        this.lambdas = new Lambdas(mod.Lambda, treeTable, readonly);
        this.gdsLayers = new GdsLayers(mod.Layers, treeTable, readonly, gdsLayerKeys);

        this.toDomain = (origin: gds.Gds) => {
            const paths = this.paths.toDomain();
            if (paths.length === 0) {
                throw new Error('Please specify at least one path for the gds');
            }
            return Object.assign({}, origin, Object.assign(this.toBaseDomain(), {
                Paths: paths,
                Lambda: this.lambdas.toDomain(),
                Layers: this.gdsLayers.toDomain(),
            }));
        };
    }
    protected getEditableListBeforeAttrs(): Array<Node<any, any>> {
        return [this.lambdas];
    }
    protected getReadonlyListBeforeAttrs(): Array<Node<any, any>> {
        return [this.lambdas];
    }
    protected getEditableListAfterCustoms(): Array<Node<any, any>> {
        return [this.gdsLayers];
    }
    protected getReadonlyListAfterCustoms(): Array<Node<any, any>> {
        return [this.gdsLayers];
    }
}
