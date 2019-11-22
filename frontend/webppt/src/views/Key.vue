<template>
    <SearchTable :suggestions="keySuggestions" class="page"
                 :nullT="getNullKey"
                 dialogWidth="500px"
                 :urlQuery="query"
                 topic="Key"
                 :searchInput="this"
    >
        <template slot="tableColumns" slot-scope="s">
            <el-table-column prop="Product" label="Product" width="120" sortable="custom"></el-table-column>
            <el-table-column prop="Names" label="Name" width="200" :formatter="fmtKeyName" sortable="custom"></el-table-column>
            <el-table-column prop="Cat" label="Category" width="120" :formatter="fmtKeyCat" sortable="custom"></el-table-column>
            <el-table-column prop="Type" label="Type" width="120" :formatter="fmtKeyType" sortable="custom"></el-table-column>
            <el-table-column prop="Res" label="Restrict" min-width="100" :formatter="fmtKeyRes"></el-table-column>
            <el-table-column prop="Time" label="Last Modified" width="150" :formatter="fmtKeyTime" sortable="custom"></el-table-column>
        </template>

        <template slot="dialog" slot-scope="s">
            <KeyEditor
                    :keyword="s.data"
                    @submitted="s.close"
            ></KeyEditor>
        </template>
    </SearchTable>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import Base from '@/components/base';
    import KeyEditor from '@/components/KeyEditor.vue';
    import SearchTable from '@/components/search/SearchTable.vue';
    import * as api from '@/api';
    import * as key from '@/api/key';
    import * as ku from '@/util/translator/key';
    import {SearchInput} from '@/components/search';

    @Component({
        components: {
            KeyEditor,
            SearchTable,
        },
    })

    export default class Key extends Base implements SearchInput<key.Key, key.KeysResp> {
        @Prop() protected readonly query!: {[key: string]: string | Array<string | null>};
        protected readonly keySuggestions: string[] = Object.keys(ku.mp).concat(
            '${Category} = ${GDS}',
            '${Type} = ${String}',
            '${Last Modified Time} > ${2019-10-11 14:19:22}',
        )
            .concat(key.categories().map((c) => key.fmtCategory(c)).map((c) => '${' + c + '}'))
            .concat(key.valueTypes().map((t) => key.fmtValueType(t)).map((t) => '${' + t + '}'));

        public canAdd(): boolean {
            return this.isAdmin();
        }

        public canEdit(row: key.Key): boolean {
            return this.isAdmin();
        }

        public canRemove(row: key.Key): boolean {
            return this.isAdmin();
        }

        public find(opt: api.FindOpt): Promise<key.KeysResp> {
            return key.find(opt);
        }

        public fmtID(row: key.Key): string {
            return row.ID;
        }

        public getItemsFromResp(r: key.KeysResp): key.Key[] {
            return r.Keys;
        }

        public getTotalCount(r: key.KeysResp): number {
            return (r as any).Total!;
        }

        public remove(token: string, row: key.Key): Promise<api.Resp> {
            return key.remove(token, row.ID);
        }

        public translateSearchFilter(input: string): string {
            return ku.translateSearch(input);
        }

        protected getNullKey(): key.Key {
            return key.nullKey();
        }

        protected fmtKeyName(k: key.Key): string {
            return key.fmtFullNames(k);
        }

        protected fmtKeyCat(k: key.Key): string {
            return key.fmtCategory(k.Cat);
        }

        protected fmtKeyType(k: key.Key): string {
            return key.fmtValueType(k.Type);
        }

        protected fmtKeyRes(k: key.Key): string {
            if (k.Res.Vals !== null && k.Res.Vals.length > 0) {
                return k.Res.Vals.join(', ');
            } else if (!api.isNullOrUndefined(k.Res.Min)) {
                if (api.isNullOrUndefined(k.Res.Max)) {
                    return `x >= ${k.Res.Min}`;
                } else {
                    return `${k.Res.Min} <= x <= ${k.Res.Max}`;
                }
            } else if (!api.isNullOrUndefined(k.Res.Max)) {
                return `x <= ${k.Res.Max}`;
            } else {
                return '';
            }
        }

        protected fmtKeyTime(k: key.Key): string {
            return api.formatTime(k.Time);
        }
    }
</script>

<style lang="scss" scoped>
    .page {
        width: 1050px;
    }
</style>
