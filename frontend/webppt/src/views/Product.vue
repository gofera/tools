<template>
  <el-container class="product" v-loading="isLoading">
    <div class="product-search">
      <el-input
              class="product-search-input"
              prefix-icon="el-icon-search"
              :placeholder="`Search by product name`"
              v-model="searchKey">
      </el-input>
      <el-button
              class="product-search-button"
              type="primary"
              v-if="isAdmin()"
              @click="addProduct"><i class="el-icon-plus"></i></el-button>
    </div>
    <el-table
            class="product-table"
            stripe
            v-loading="isLoading"
            :data="searchedProducts"
            element-loading-text="loading"
            empty-text="No matching products found."
            :height="600"
    >
      <el-table-column prop="Name" label="Product" min-width="400" resizable sortable></el-table-column>
      <el-table-column label="Operations" width="200">
        <template slot-scope="props">
          <el-container class="product-table-button-list">
            <el-button
                    class="product-table-button"
                    type="primary"
                    icon="el-icon-edit"
                    :disabled="!isAdmin()"
                    @click="updateProduct(props.row)"
                    circle></el-button>
            <el-button
                    class="product-table-button"
                    type="danger"
                    icon="el-icon-delete"
                    :disabled="!isAdmin()"
                    @click="deleteProduct(props.row)"
                    circle></el-button>
          </el-container>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="topicTitle" @close="closeDialog(false)" :visible.sync="showDlg" width="300px"
               :close-on-click-modal="false">
      <el-form :model="prod">
        <el-form-item label="Product">
          <el-input class="form-item" v-model="prod.Name"
                    @keyup.enter.native="onConfirm" placeholder="Input product name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(false)">Cancel</el-button>
        <el-button type="primary" :disabled="prod.Name.trim() === ''" @click="onConfirm">Confirm</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script lang="ts">
  import {Component} from 'vue-property-decorator';
  import * as api from '@/api';
  import * as perm from '@/api/perm';
  import * as product from '@/api/product';
  import Base from '@/components/base';

  @Component
  export default class Product extends Base {
    protected readonly prod: product.Product = product.getNull();
    protected products: product.Product[] = [];
    protected showDlg: boolean = false;
    protected isLoading: boolean = false;
    protected searchKey: string = '';

    protected toModified: boolean = false;

    public async mounted() {
      this.isLoading = true;
      try {
        await this.fetchProducts();
      } catch (e) {
        this.showErrMsg(e, 'Fetch Products');
      }
      this.isLoading = false;
    }

    protected get searchedProducts(): product.Product[] {
      return this.products.filter((p) =>
              p.Name.toLowerCase().includes(this.searchKey.toLowerCase()));
    }

    protected addProduct(): void {
      this.updateProduct(product.getNull());
    }

    protected get topicTitle(): string {
      return this.toModified ? 'Update Product' : 'New Product';
    }

    protected updateProduct(p: product.Product): void {
      Object.assign(this.prod, p);
      this.toModified = p.ID !== '';
      this.showDlg = true;
    }

    protected async deleteProduct(p: product.Product) {
      try {
        const topic = `Delete Product ${p.Name}`;
        await this.$confirm(`Are you sure to delete product of ${p.Name}?`);
        this.isLoading = true;
        try {
          const r = await this.callApiWithToken((token) => product.remove(token, p.Name));
          this.showRespMessage(r, topic);
          if (r.Code === api.RespCode.OK) {
            await this.fetchProducts();
          }
        } catch (e) {
          this.showErrMsg(e, topic);
        }
        this.isLoading = false;
      } catch (e) {
        // do nothing
      }
    }

    protected async closeDialog(ifConfirm: boolean) {
      if (!this.showDlg) { // prevent call twice
        return;
      }
      this.showDlg = false;
      if (ifConfirm) {
        this.isLoading = true;
        try {
          await this.fetchProducts();
        } catch (e) {
          this.showErrMsg(e, 'Fetch Products');
        }
        this.isLoading = false;
      }
    }

    protected async onConfirm() {
      this.prod.Name = this.prod.Name.trim();
      if (this.prod.Name === '') {
        return;
      }
      try {
        const r = await this.callApiWithToken((token) => {
          if (this.toModified) {
            return product.update(token, this.prod);
          } else {
            return product.add(token, this.prod.Name);
          }
        });
        this.showRespMessage(r, this.topicTitle);
        await this.closeDialog(r.Code === api.RespCode.OK);
      } catch (e) {
        this.showErrMsg(e, this.topicTitle);
      }
    }

    private async fetchProducts() {
      const r = await product.getAll();
      if (r.Code === api.RespCode.OK) {
        this.products = r.Prods;
      } else {
        this.showRespMessage(r, 'Fetch Products');
      }
    }
  }
</script>

<style lang='scss' scoped>
  .product {
    height:100%;
    width: 650px;
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
</style>
