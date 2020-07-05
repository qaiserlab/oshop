<template>
  <main-layout>
    <ui-splash :display="splash">{{ result.message }}</ui-splash>

    <section class="content-header">
      <h1>
        Produk
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li>
          <a href="#/product/all-data">
            Produk
          </a>
        </li>
        <li class="active">
          Ubah Data
        </li>
      </ol>
    </section>

    <section class="content">
      <ui-alert :data-source="result.data"
      :display="result.state == 'invalid'"
      @close="result.state = ''">
        {{ result.message }}
      </ui-alert>

      <ui-row>
        <ui-col size="md-8">

          <ui-panel title="Editor" icon="edit">
            <ui-row form-group>
              <ui-col size="md-3">Nama Produk</ui-col>
              <ui-col size="md-9">
                <ui-textbox v-model="form.productName"></ui-textbox>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-3">ID Produk</ui-col>
              <ui-col size="md-9">
                <ui-textbox v-model="form.productId"></ui-textbox>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-3">SKU Number</ui-col>
              <ui-col size="md-9">
                <ui-textbox v-model="form.skuNumber"></ui-textbox>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-3">Berat (Gram)</ui-col>
              <ui-col size="md-9">
                <ui-textbox v-model="form.weight" only-numeric></ui-textbox>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-3">PV</ui-col>
              <ui-col size="md-9">
                <ui-textbox v-model="form.point" only-numeric></ui-textbox>
              </ui-col>
            </ui-row>
          </ui-panel>

        </ui-col>
        <ui-col size="md-4">

          <ui-panel title="Settings" icon="edit">
            <ui-row form-group>
              <ui-col size="md-3">Publikasi</ui-col>
              <ui-col size="md-9">
                <ui-select v-model="form.publication" :data-source="rsPublication"></ui-select>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-3">Kategori</ui-col>
              <ui-col size="md-9">
                <ui-select v-model="form.productCategory.title"
                :data-source="rsProductCategory"
                data-value="title"
                data-field="title"></ui-select>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-3"></ui-col>
              <ui-col size="md-9">
                <checkbox v-model="form.newItem">New Item</checkbox>
                <checkbox v-model="form.bestSellerItem">Best Seller Item</checkbox>
                <checkbox v-model="form.saleItem">Sale Item</checkbox>
              </ui-col>
            </ui-row>
          </ui-panel>

        </ui-col>
      </ui-row>

      <ui-row>
        <ui-col size="md-12">

          <ui-panel title="Gambar" icon="edit">
            <ui-row>
              <ui-col size="md-3">
                <ui-image style="margin: 4px" v-model="form.featuredImage"></ui-image>
                <div style="position: absolute; right: 22px; top: 6px;">
                  <ui-button
                  @click="addImage"
                  icon="plus"></ui-button>
                </div>
              </ui-col>

              <ui-col v-for="(row, i) in form.images" :key="row._id" size="md-3">
                <ui-image style="margin: 4px" v-model="form.images[i]"></ui-image>

                <div style="position: absolute; right: 22px; top: 6px;">
                  <ui-button
                  @click="addImage"
                  icon="plus"></ui-button>
                  <ui-button
                  @click="removeImage(i)"
                  icon="close"
                  bs-type="danger"></ui-button>
                </div>
              </ui-col>

            </ui-row>
          </ui-panel>

          <ui-panel class="product-prices" title="Harga" icon="edit">
            <ui-row form-group>
              <ui-col size="md-1" style="text-align: right">
                <b>Warna</b>
              </ui-col>
              <ui-col size="md-2">
                <b>Ukuran</b>
              </ui-col>
              <ui-col size="md-5">
                <b>Harga</b>
              </ui-col>
              <ui-col size="md-1">
                <b>Diskon</b>
              </ui-col>
              <ui-col size="md-1">
                <b>Qty</b>
              </ui-col>
              <ui-col size="md-2">
                <b>Action</b>
              </ui-col>
            </ui-row>
            <hr>

            <ui-row v-for="(row, i) in form.prices" :key="row._id" form-group>
              <ui-col size="md-1">
                <ui-button
                @click="showColorPicker(i)"
                bs-type="basic">
                  <i class="fa fa-square" :style="'color:' + row.color"></i>
                </ui-button>
              </ui-col>
              <ui-col size="md-2">
                <ui-select v-model="row.size" :data-source="rsSize"></ui-select>
              </ui-col>
              <ui-col size="md-5">
                <ui-textbox v-model="row.price" only-numeric></ui-textbox>
              </ui-col>
              <ui-col size="md-1">
                <ui-textbox v-model="row.discount"
                only-numeric></ui-textbox>
                <span class="unit">%</span>
              </ui-col>
              <ui-col size="md-1">
                <ui-textbox v-model="row.quantity" only-numeric></ui-textbox>
              </ui-col>
              <ui-col size="md-2">
                <ui-button
                @click="addPrice"
                icon="plus"></ui-button>
                <ui-button
                @click="removePrice(i)"
                :disabled="form.prices.length<=1?true:false"
                icon="close"
                bs-type="danger"></ui-button>
              </ui-col>
            </ui-row>

            <ui-modal @close="colorPicker = false"
            :display="colorPicker"
            title="Color Picker"
            icon="paint-brush">
              <div slot="message">
                <ui-row>
                  <ui-col size="md-5">
                    <color-picker v-model="colorActive"></color-picker>
                  </ui-col>
                  <ui-col size="md-7">
                    <div class="color-box"
                    :style="'background:' + colorActive.hex"></div>
                  </ui-col>
                </ui-row>
              </div>
              <div slot="buttonbar">
                <ui-button @click="updateColor">OK</ui-button>
                <ui-button @click="colorPicker = false" bs-type="danger">Batal</ui-button>
              </div>
            </ui-modal>

          </ui-panel>

          <ui-panel title="Content" icon="edit">

            <ui-row form-group>
              <ui-col size="md-12">Overview</ui-col>
              <ui-col size="md-12">
                <ui-textarea v-model="form.overview"></ui-textarea>
              </ui-col>
            </ui-row>
            <ui-row form-group>
              <ui-col size="md-12">Description</ui-col>
              <ui-col size="md-12">
                <trumbowyg v-model="form.description"></trumbowyg>
              </ui-col>
            </ui-row>
            <ui-row form-group>
              <ui-col size="md-12">Size Guide</ui-col>
              <ui-col size="md-12">
                <trumbowyg v-model="form.sizeGuide"></trumbowyg>
              </ui-col>
            </ui-row>

          </ui-panel>

        </ui-col>
      </ui-row>
    </section>

    <ui-buttonbar>
      <ui-button href="#/product/all-data"
      bs-type="danger"
      icon="arrow-left"></ui-button>
      <ui-button @click="saveData" :loading="loading" icon="floppy-o"></ui-button>
      <ui-button href="#/product/add-new-data" icon="plus"></ui-button>
    </ui-buttonbar>

  </main-layout>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {

    /************************
    <id="_data">
    ************************/
    data() {
      return {
        loading: false,
        splash: false,

        colorPicker: false,
        colorIndex: -1,
        colorActive: { hex: '' },

        result: {
          state: '',
          message: '',
          data: {},
        },

        form: {
          productName: '',
          productId: '',
          skuNumber: '',
          weight: '',
          point: '',

          prices: [],

          overview: '',
          description: '',
          sizeGuide: '',

          publication: '',
          productCategory: {
            title: '',
            slug: '',
          },

          newItem: false,
          bestSellerItem: false,
          saleItem: false,

          featuredImage: '',
          images: [],
        },

      };
    },

    /************************
    <id="_computed">
    ************************/
    computed: {
      /************************
      <id="_mapGetters">
      ************************/
      ...mapGetters('PublicationStore', {
        rsPublication: 'rs',
      }),
      ...mapGetters('SizeStore', {
        rsSize: 'rs',
      }),
      ...mapGetters('ProductCategoryStore', {
        rsProductCategory: 'rs',
      }),
      ...mapGetters('ProductStore', {
        rowActive: 'rowActive',
      }),
    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
      this.moveData(this.$route.params.id);

      this.form.productName = this.rowActive.productName;
      this.form.productId = this.rowActive.productId;
      this.form.skuNumber = this.rowActive.skuNumber;
      this.form.weight = this.rowActive.weight;
      this.form.point = this.rowActive.point;

      this.form.prices = this.rowActive.prices;

      this.form.overview = this.rowActive.overview;
      this.form.description = this.rowActive.description;
      this.form.sizeGuide = this.rowActive.sizeGuide;

      this.form.publication = this.rowActive.publication;
      this.form.productCategory = this.rowActive.productCategory;

      this.form.newItem = this.rowActive.newItem;
      this.form.bestSellerItem = this.rowActive.bestSellerItem;
      this.form.saleItem = this.rowActive.saleItem;

      this.form.featuredImage = this.rowActive.featuredImage;
      this.form.images = this.rowActive.images;
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_mapActions">
      ************************/
      ...mapActions('ProductStore', {
        moveData: 'moveData',
        updateData: 'updateData',
      }),

      /************************
      <id="_saveData">
      ************************/
      saveData() {
        this.loading = true;

        this.updateData(this.form).then(result => {

          this.loading = false;
          this.result = result;

          this.splash = true;

          setTimeout(() => {
            this.splash = false;
          }, 2000);

        }).catch(result => {

          this.loading = false;
          this.result = result;

        });
      },

      /************************
      <id="_addImage">
      ************************/
      addImage() {
        this.form.images.push('');
      },

      /************************
      <id="_removeImage">
      ************************/
      removeImage(index) {
        this.form.images.splice(index, 1);
      },

      /************************
      <id="_addPrice">
      ************************/
      addPrice() {
        this.form.prices.push({
          color: '',
          size: '',
          price: '',
          discount: '',
          quantity: '',
          action: '',
        });
      },

      /************************
      <id="_removePrice">
      ************************/
      removePrice(index) {
        this.form.prices.splice(index, 1);
      },

      /************************
      <id="_showColorPicker">
      ************************/
      showColorPicker(index) {
        this.colorActive.hex = this.form.prices[index].color;
        this.colorIndex = index;
        this.colorPicker = true;
      },

      /************************
      <id="_updateColor">
      ************************/
      updateColor(index) {
        this.form.prices[this.colorIndex].color = this.colorActive.hex;
        this.colorPicker = false;
      },

    },

  }
</script>
