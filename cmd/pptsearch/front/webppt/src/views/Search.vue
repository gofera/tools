<template>
  <el-container class="product" v-loading="isLoading">
    <div class="product-search">
      <el-input
              class="product-search-input"
              prefix-icon="el-icon-search"
              :placeholder="`Search by input a keyword like grep`"
              @keyup.enter.native="onSearch"
              v-model="searchKey">
        <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
      </el-input>
    </div>
    <el-tree
            class="search-tree"
            :data="nodes"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <a :href="data.url" target="_blank">{{data.label}}</a>
      </span>
    </el-tree>
  </el-container>
</template>

<script lang="ts">
  import {Component} from 'vue-property-decorator';
  import * as api from '@/api';
  import Base from '@/components/base';

  interface Node {
    id: number;
    label: string;
    url: string;
    children?: Node[];
  }

  @Component
  export default class Search extends Base {
    protected isLoading: boolean = false;
    protected searchKey: string = '';
    protected nodes: Node[] = [];

    protected async onSearch() {
      this.isLoading = true;
      try {
        const resp = await api.search(this.searchKey);
        this.nodes = [];
        for (const it of resp) {
          const n: Node = {
            id: Math.random(),
            label: it.Path,
            url: it.Path,
            children: [],
          };
          for (const line of it.Lines) {
            const child: Node = {
              id: Math.random(),
              label: line.Text,
              url: `${it.Path}#${line.Section + 1}`,
            };
            n.children!.push(child);
          }
          this.nodes.push(n);
        }
      } catch (e) {
        this.showErrMsg(e, 'Search Web PPT');
      } finally {
        this.isLoading = false;
      }
    }
  }
</script>

<style lang='scss' scoped>
  .product {
    height:100%;
    width: 1000px;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    padding: 10px 10px;
    background-color: white;
    .product-search {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      height: 60px;
      margin-bottom: 20px;
      .product-search-button {
        margin-left: 10px;
      }
    }
    .product-table-button-list {
      display: flex;
      .product-table-button {
      }
    }
    .product-table {
      height: 100%;
    }
  }
  .form-item {
    width: 250px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .search-tree {
    overflow:auto;
  }
</style>
