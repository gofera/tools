<template>
    <el-container class="page" v-loading="isLoading">
        <div class="page-search">
            <Search
                    v-model="searchKey"
                    @search="onInputSearch"
                    :initValue="searchKey"
                    :extraSuggestions="suggestions"
            ></Search>
            <el-button
                    class="page-search-button"
                    type="primary"
                    v-if="searchInput.canAdd()"
                    @click="onAdd"><i class="el-icon-plus"></i></el-button>
        </div>
        <el-pagination
                class="pagination"
                @size-change="sizeChange"
                @current-change="currentChange"
                :page-sizes="pageSizeOptions"
                :current-page="currentPage"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
        </el-pagination>
        <el-table
                class="page-table"
                stripe
                border
                v-loading="isLoading"
                :data="items"
                @sort-change="sortChange"
                element-loading-text="loading"
                empty-text="No matching found."
                size="mini"
                :height="600"
        >
            <slot name="tableColumns" :lastEdited="lastEdit"></slot>
            <el-table-column label="Operations" width="120">
                <template slot-scope="props">
                    <el-container class="page-table-button-list">
                        <el-button
                                class="page-table-button"
                                type="primary"
                                icon="el-icon-edit"
                                :disabled="!searchInput.canEdit(props.row)"
                                @click="onUpdate(props.row)"
                                circle></el-button>
                        <el-button
                                class="page-table-button"
                                type="danger"
                                icon="el-icon-delete"
                                :disabled="!searchInput.canRemove(props.row)"
                                @click="onDelete(props.row)"
                                circle></el-button>
                    </el-container>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="topicTitle" @close="closeDialog(false)" :visible.sync="showDlg"
                   :width="dialogWidth" :close-on-click-modal="false">
            <slot name="dialog" :data="item" :close="closeDialog"></slot>
        </el-dialog>
    </el-container>
</template>

<script lang="ts">
    import Component from 'vue-class-component';
    import Base from '@/components/base';
    import Search from '@/components/search/Search.vue';
    import * as api from '@/api';
    import * as ut from '@/util';
    import lodash from 'lodash';
    import {Prop} from 'vue-property-decorator';
    import {SearchInput} from '@/components/search';

    @Component({
        components: {
            Search,
        },
    })
    export default class SearchTable<T, RS extends api.Resp> extends Base {
        @Prop({default: () => []}) protected readonly suggestions!: string[];
        @Prop({default: () => void 0}) protected readonly nullT!: () => T;
        @Prop({default: '60%'}) protected readonly dialogWidth!: string;  // % or px
        @Prop() protected readonly urlQuery!: {[key: string]: string | Array<string | null>};

        @Prop() protected searchInput!: SearchInput<T, RS>;

        protected item: T = this.nullT();
        protected items: T[] = [];
        protected showDlg: boolean = false;
        protected isLoading: boolean = false;
        protected searchKey: string = '';
        protected totalCount: number = 0;
        protected pageSize: number = 20;
        protected currentPage: number = 1;
        protected readonly pageSizeOptions = [10, 20, 30, 50, 100];
        protected lastEdit: ut.EditedRow<T> = {};  // used for updated value such as model's tree in expanded table

        @Prop() private readonly topic!: string;

        private toModified: boolean = false;
        private sortColumn?: string;
        private desc?: boolean;

        private currentEditRow?: T;

        public created() {
            if (this.urlQuery !== undefined) {
                const filter = this.urlQuery.filter as string;
                this.searchKey = filter !== undefined ? filter : '';

                const limit = this.urlQuery.limit as string;
                if (limit !== '' && !isNaN(Number(limit)) && this.pageSizeOptions.includes((Number(limit)))) {
                    this.pageSize = Number(limit);
                }

                const skip = this.urlQuery.skip as string;
                if (skip !== '' && !isNaN(Number(skip))) {
                    this.currentPage = (Number(skip) / this.pageSize) + 1;
                }

                const sortkey = this.urlQuery.sortkey as string;
                this.sortColumn = sortkey !== '' ? sortkey : undefined;

                const desc = this.urlQuery.desc as string;
                this.desc = desc !== '' ? desc === 'true' : undefined;
            }
        }

        public async mounted() {
            await this.onSearch();
        }

        protected onAdd(): void {
            this.onUpdate(this.nullT(), false);
        }

        protected onUpdate(t: T, toModified = true): void {
            if (toModified) {
                this.currentEditRow = t;
            } else {
                this.currentEditRow = void 0;
            }
            this.item = lodash.cloneDeep(t);
            this.toModified = toModified;
            this.showDlg = true;
        }

        protected get topicTitle(): string {
            return this.toModified ? `Update ${this.topic} ${this.searchInput.fmtID(this.item)}` : `New ${this.topic}`;
        }

        protected async onDelete(t: T) {
            try {
                const topic = `Delete ${this.topic} ${this.searchInput.fmtID(t)}`;
                await this.$confirm(`Are you sure to ${topic}?`);
                this.isLoading = true;
                try {
                    const r = await this.callApiWithToken((token) => this.searchInput.remove(token, t));
                    this.showRespMessage(r, topic);
                    if (r.Code === api.RespCode.OK) {
                        if (this.currentPage > 1 && this.totalCount === (this.currentPage - 1) * this.pageSize + 1) {
                            this.currentPage--;
                        }
                        await this.fetch();
                    }
                } catch (e) {
                    this.showErrMsg(e, topic);
                } finally {
                    this.isLoading = false;
                }
            } catch (e) {
                // do nothing
            }
        }

        protected async closeDialog(ifConfirm: boolean, updatedItem?: T) {
            if (!this.showDlg) { // prevent call twice
                return;
            }
            this.showDlg = false;
            if (ifConfirm) {
                if (!this.toModified) {  // created
                    this.totalCount++;
                    this.currentPage = this.totalPage;

                    this.isLoading = true;
                    try {
                        await this.fetch();
                    } catch (e) {
                        this.showErrMsg(e, `Fetch ${this.topic}s`);
                    } finally {
                        this.isLoading = false;
                    }
                } else if (updatedItem !== void 0 && this.currentEditRow !== void 0) {
                    // updated, don't have to fetch all, but just update current row data
                    Object.assign(this.currentEditRow, updatedItem); // update table row
                    this.lastEdit = {row: this.currentEditRow};  // update slot such as model table's expanded tree
                    this.currentEditRow = void 0;
                }
            }
        }

        protected async onInputSearch() {
            // new input should reset the current page to 1
            this.currentPage = 1;
            await this.onSearch();
        }

        protected async onSearch() {
            this.isLoading = true;
            try {
                await this.fetch();
                // TODO: to record the history (keep latest 20 items) that user inputs, need to cache in local storage
                //  (vuex store), and apply at the end of suggestion. The history tip should be started
                //  with 'history: ', and when we select, the search text should be replaces (without 'history: '
                //  prefix) instead of insert. If the search key has already been in the vuex store, move it to the
                //  latest one. (code refer to find code project)
            } catch (e) {
                this.showErrMsg(e, `Fetch ${this.topic}s`);
            }
            this.isLoading = false;
        }

        protected async sizeChange(val: number) {
            this.pageSize = val;
            await this.onSearch();
        }

        protected async currentChange(val: number) {
            this.currentPage = val;
            await this.onSearch();
        }

        protected async sortChange(evt: { column: object, prop: string, order: string }) {
            // To translate "ascending" and "descending" or null to boolean that api required.
            if (evt.order) {
                this.sortColumn = evt.prop.toLowerCase();
                this.desc = evt.order === 'descending';
            } else {
                this.sortColumn = undefined;
                this.desc = undefined;
            }
            await this.onSearch();
        }

        private get totalPage(): number {
            if (this.totalCount === 0) {
                return 0;
            }
            return 1 + Math.floor((this.totalCount - 1) / this.pageSize);
        }

        private async fetch() {
            let filter = '';
            if (this.searchKey !== '') {
                filter = this.searchInput.translateSearchFilter(this.searchKey);
            }
            const findOpt = {
                filter,
                limit: this.pageSize,
                skip: (this.currentPage - 1) * this.pageSize,
                returntotal: true,
                sortkey: this.sortColumn,
                desc: this.desc,
            };
            const r = await this.searchInput.find(findOpt);
            const newPath = this.$router.currentRoute.path + '?' + ut.serialize(findOpt, undefined, ['returntotal']);
            if (this.$router.currentRoute.fullPath !== newPath) {
                this.$router.push(newPath);
            }
            if (r.Code === api.RespCode.OK) {
                this.items = this.searchInput.getItemsFromResp(r);
                this.totalCount = this.searchInput.getTotalCount(r);
            } else {
                this.showRespMessage(r, `Fetch ${this.topic}s`);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-container {
        display: flex;
        width: 100%;
        height: auto;
        justify-content: space-between;

        .left {
            width: 40%;
        }

        .right {
            width: 58%;
        }
    }

    .page {
        height: 100%;
        width: 100%;
        margin: 20px auto;
        display: flex;
        flex-direction: column;
        padding: 10px 10px;
        background-color: white;

        .page-search {
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            height: 60px;

            .page-search-input {
                width: 100%;
            }

            .page-search-button {
                margin-left: 10px;
            }
        }

        .page-table-button-list {
            display: inherit;

            .page-table-button {
            }
        }

        .page-table {
            height: 100%;
        }
    }

    .pagination {
        width: 100%;
        margin: 10px;
    }
</style>
