<template>
  <main-layout>

    <section class="content-header">
      <h1>
        Laporan Produk Best Seller
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li class="active">
          Laporan Produk Best Seller
        </li>
      </ol>
    </section>

    <section class="content">

      <ui-panel title="List" :loading="loading" icon="table">

        <ui-row form-group>
          <!-- <ui-col size="md-3">
            <ui-textbox v-model="form.memberId"
            placeholder="Type Username"></ui-textbox>
          </ui-col> -->

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

            <table class="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID Produk</th>
                  <th>Produk</th>
                  <th>Ukuran</th>
                  <th style="text-align: center">Warna</th>
                  <th>Harga</th>
                  <th>Qty</th>
                  <th>Sub Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in rs">
                  <td>{{ row.rank }}</td>
                  <td>{{ row.ID_Produk }}</td>
                  <td>{{ row.produk }}</td>
                  <td>{{ row.ukuran }}</td>
                  <td style="text-align: center">
                    <i class="fa fa-square" :style="{ color: row.warna }"></i>

                  </td>
                  <td>{{ row.harga }}</td>
                  <td>{{ row.qty }}</td>
                  <td>{{ row.sub_Total }}</td>
                </tr>
              </tbody>
            </table>

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
      ...mapGetters('BestSellerProductStore', {
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
      ...mapActions('BestSellerProductStore', {
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
