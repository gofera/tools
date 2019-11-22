<template>
    <el-autocomplete
            id="search-input"
            class="search-input"
            placeholder="Press Enter Key to Search"
            prefix-icon="el-icon-search"
            clearable
            @keyup.enter.native="onSearchTextKeyUp"
            v-model="value"
            @input="handleChange"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="true"
            @select="handleSelect"
    >
        <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
    </el-autocomplete>
</template>

<script lang="ts">
    import {Vue, Component, Emit, Prop, Watch} from 'vue-property-decorator';
    import * as util from '../../util';

    interface Suggestion {
        value: string;
    }

    @Component
    export default class Search extends Vue {
        private static readonly basicSuggestions: string[] = [
            'and', 'or', 'not', 'exists',
            'like "regex such as .*?"', 'in ( v1, v2, v3 )', 'between v1 and v2',
            'true', 'false', 'null',
            '=', '!=', '<', '<=', '>', '>=',
        ];

        protected value: string = '';
        @Prop({default: ''}) protected initValue!: string;
        @Prop({default: []}) private extraSuggestions!: string[];
        private selectingSuggestion: boolean = false;
        private suggestions: Suggestion[] = Search.basicSuggestions.map((s: string) => ({value: s}));

        public mounted() {
            this.value = this.initValue;
            this.onExtraSuggestionsChanged(this.extraSuggestions, []);
        }

        @Emit('input')
        protected handleChange(v: string) {
            // do nothing
        }

        protected async onSearchTextKeyUp() {
            if (this.selectingSuggestion) {
                this.selectingSuggestion = false;
                return;
            }
            await this.onSearch();
        }

        @Emit('search')
        protected async onSearch() {
            // do nothing
        }

        protected async handleSelect(item: Suggestion) {
            this.selectingSuggestion = true;
            setTimeout(() => this.selectingSuggestion = false, 400);
            await this.insertAtCursor(item.value);
        }

        protected querySearch(queryString: string, cb: (res: Suggestion[]) => void) {
            const results = queryString ? this.suggestions.filter(this.createFilter(queryString)) : this.suggestions;
            // callback return suggestion list
            cb(results);
        }

        @Watch('extraSuggestions')
        private onExtraSuggestionsChanged(v: string[], old: string[]): void {
            this.suggestions = Search.basicSuggestions.concat(...v).map((s: string) => ({value: s}));
        }

        private createFilter(queryString: string): (s: Suggestion) => boolean {
            const myField: HTMLInputElement|null = document.querySelector('#search-input');
            if (myField === null) {
                return (s) => true;
            }
            return (suggestion) => {
                if (myField.selectionStart || myField.selectionStart === 0) {
                    const startPos = myField.selectionStart;
                    queryString = myField.value.substring(0, startPos);
                }
                const q: string = queryString.split(' ').pop() as string;
                if (q.length > 0 && q[q.length - 1] === '}') {
                    return false;
                }
                return (suggestion.value.toLowerCase().indexOf(q.toLowerCase()) >= 0);
            };
        }

        private async insertAtCursor(v: string) {
            const myField: HTMLInputElement|null = document.querySelector('#search-input');
            if (myField === null) {
                return;
            }
            if (myField.selectionStart || myField.selectionStart === 0) {
                const startPos = myField.selectionStart;
                let endPos = myField.selectionEnd!;
                const textAndEnd = util.insertTip(myField.value, v, startPos, endPos);
                this.setValueAndEmit(textAndEnd.text);
                endPos = textAndEnd.end;
                await this.$nextTick();  // important: wait and then focus
                myField.focus();
                myField.setSelectionRange(endPos + v.length, endPos + v.length);
            } else {
                this.setValueAndEmit(this.value + v);
            }
        }

        private setValueAndEmit(v: string): void {
            this.value = v;
            this.handleChange(this.value);
        }
    }
</script>

<style lang="scss" scoped>
    .search-input {
        width: 100%;
    }
</style>
