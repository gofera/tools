<template>
    <SearchTable :suggestions="resSuggestions" class="page"
          :nullT="tableInput.getNull"
          dialogWidth="900px"
          :urlQuery="query"
          :topic="tableInput.getTopic()"
          :searchInput="this"
    >
        <template slot="tableColumns" slot-scope="s">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <TreeEditor :mod="props.row" :keys="keywords" :readonly="true" :editedMod="s.lastEdited"
                                :treeInput="tableInput.getTreeInput()">
                    </TreeEditor>
                </template>
            </el-table-column>
            <slot name="colBeforePath"></slot>
            <el-table-column prop="Paths" label="Path" min-width="100">
                <template slot-scope="props">
                    <div v-for="item in props.row.Paths" :key="item">
                        {{item}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="Status" label="Status" width="70">
                <Tooltip slot-scope="scope" :tooltip="scope.row.Err">
                    <span :class="styleStatus(scope.row.Status)">
                        {{fmtStatus(scope.row.Status)}}
                    </span>
                </Tooltip>
            </el-table-column>
            <el-table-column label="Last Modified" align="center">
                <el-table-column prop="LastModified.Time" label="Time" width="150" :formatter="fmtLastModifiedTime" sortable="custom"></el-table-column>
                <el-table-column prop="LastModified.User" label="User" width="80" sortable="custom"></el-table-column>
            </el-table-column>
        </template>

        <template slot="dialog" slot-scope="s">
            <TreeEditor :mod="s.data" :keys="keywords" @submitted="s.close" :treeInput="tableInput.getTreeInput()"></TreeEditor>
        </template>
    </SearchTable>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import TreeEditor from '@/components/tree/TreeEditor.vue';
    import * as api from '@/api';
    import * as key from '@/api/key';
    import SearchTable from '@/components/search/SearchTable.vue';
    import Base from '@/components/base';
    import * as search from '@/components/search';
    import {Res} from '@/api/resource';
    import {SearchInput} from '@/components/search';
    import Tooltip from '@/components/tree/Tooltip.vue';
    import lodash from 'lodash';

    @Component({
        components: {
            TreeEditor,
            SearchTable,
            Tooltip,
        },
    })
    export default class ResourceTable<T extends Res, R extends api.Resp, RS extends api.Resp>
        extends Base implements SearchInput<T, RS> {
        @Prop() protected readonly query!: {[key: string]: string | Array<string | null>};
        protected isLoading: boolean = false; // TODO: shared with SearchTable.isLoading
        protected resSuggestions: string[] = [];
        protected keywords: key.Key[] = [];

        @Prop() protected tableInput!: search.ResTableInput<T, R, RS>;

        public async mounted() {
            this.resSuggestions = Object.keys(this.tableInput.getSuggestionTranslater().getMapping()).concat(
                '${Created Time} > ${2019-10-11 14:19:22}',
                '${Last Modified Time} > ${2019-10-11 14:19:22}',
            );

            this.isLoading = true;
            try {
                const r = await this.tableInput.getKeywords();
                if (r.Code === api.RespCode.OK) {
                    this.keywords = r.Keys.sort((a: key.Key, b: key.Key) => {
                        return a.Names[0].localeCompare(b.Names[0]);
                    });
                    // use lodash.flatMap instead of keywords.flatMap is because to use in old browser such as Edge
                    const attrTips = lodash.flatMap(this.keywords, (k) => k.Names)
                        .map((name) => '${Attribute.' + name + '}');
                    this.resSuggestions.push(...attrTips);
                } else {
                    this.showRespMessage(r, 'Fetch Keywords');
                }
            } catch (e) {
                this.showErrMsg(e, 'Fetch Keywords');
            } finally {
                this.isLoading = false;
            }
        }

        public addSuggestion(...suggestions: string[]): void {
            this.resSuggestions.push(...suggestions);
        }

        public canAdd(): boolean {
            return this.isEditor();
        }

        public canEdit(row: T): boolean {
            return this.isEditor();
        }

        public canRemove(row: T): boolean {
            return this.isAdmin();
        }

        public find(opt: api.FindOpt): Promise<RS> {
            return this.tableInput.find(opt);
        }

        public fmtID(row: T): string {
            return row.ID;
        }

        public getItemsFromResp(r: RS): T[] {
            return this.tableInput.getResourcesFromResp(r);
        }

        public getTotalCount(r: RS): number {
            return this.tableInput.getCount(r);
        }

        public remove(token: string, row: T): Promise<api.Resp> {
            return this.tableInput.remove(token, row);
        }

        public translateSearchFilter(input: string): string {
            return this.tableInput.getSuggestionTranslater().translateSearch(input);
        }

        protected fmtLastModifiedTime(m: T): string {
            return api.formatTime(m.LastModified.Time);
        }

        protected fmtStatus(s: api.Status): string {
            return api.toStringForStatus(s);
        }

        protected styleStatus(s: api.Status): string {
            switch (s) {
                case api.Status.DONE:
                    return 'status-ok';
                case api.Status.PENDING:
                    return 'status-pending';
                default:
                    return 'status-err';
            }
        }
    }
</script>

<style lang="scss" scoped>
    .page {
        width: 1000px;
    }
    .status-ok {
        color: green;
    }
    .status-pending {
        color: purple;
    }
    .status-err {
        color: red;
    }
</style>
