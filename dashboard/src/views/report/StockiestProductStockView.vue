<template>
  <main-layout>

    <section class="content-header">
      <h1>
        Laporan Stok Produk Stokist
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li class="active">
          Laporan Stok Produk Stokist
        </li>
      </ol>
    </section>

    <section class="content">

      <ui-panel title="List" :loading="loading" icon="table">

        <ui-row form-group>
          <ui-col size="md-3">
            <ui-textbox v-model="form.memberId"
            placeholder="Type Username"></ui-textbox>
          </ui-col>

          <ui-col size="md-9">

            <ui-datepicker v-model="form.fromDate"
            style="display: inline-block"></ui-datepicker>
            <ui-datepicker v-model="form.toDate"
            style="display: inline-block">s/d</ui-datepicker>

            <ui-button @click="refreshData"
            :loading="loading"
            style="display: inline-block">Generate</ui-button>
          </ui-col>
        </ui-row>

        <ui-row form-group>
          <ui-col size="md-12">

            <v-client-table :data="rs"
            :columns="['produk', 'masuk', 'keluar', 'sisa']">
            </v-client-table>

          </ui-col>
        </ui-row>

      </ui-panel>
    </section>

    <ui-buttonbar>
      <ui-button bs-type="success" @click="refreshData" :loading="loading" icon="refresh"></ui-button>
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
      let dFromDate = new Date();
      let dToDate = new Date();
      let fromDate = dFromDate.getFullYear() + '-' + (dFromDate.getMonth() + 1) + '-' + dFromDate.getDate();
      let toDate = dToDate.getFullYear() + '-' + (dToDate.getMonth() + 1) + '-' + dToDate.getDate();

      return {
        loading: false,

        form: {
          memberId: '',
          fromDate,
          toDate,
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
      ...mapGetters('StockiestProductStockStore', {
        rs: 'rs',
        rowActive: 'rowActive',
      }),

    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
      this.refreshData();
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_mapActions">
      ************************/
      ...mapActions('StockiestProductStockStore', {
        fetchData: 'fetchData',
        moveData: 'moveData',
      }),

      /************************
      <id="_refreshData">
      ************************/
      refreshData() {
        this.loading = true;
        this.fetchData(this.form).then(result => {
          this.loading = false;
        });
      },

    },

  }
</script>
