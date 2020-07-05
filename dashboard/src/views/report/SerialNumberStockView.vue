<template>
  <main-layout>

    <section class="content-header">
      <h1>
        Laporan Stok Serial Number
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li class="active">
          Laporan Stok Serial Number
        </li>
      </ol>
    </section>

    <section class="content">

      <ui-panel title="List" :loading="loading" icon="table">

        <ui-row form-group>
          <ui-col size="md-12">
            <ui-datepicker v-model="form.monthYear"
            type="monthly"
            style="display: inline-block"></ui-datepicker>

            <ui-button @click="refreshData"
            :loading="loading"
            style="display: inline-block">Generate</ui-button>
          </ui-col>
        </ui-row>

        <ui-row form-group>
          <ui-col size="md-12">

            <v-client-table :data="rs"
            :columns="['member_ID', 'nama_Lengkap', 'masuk', 'keluar', 'sisa']">
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
      let d = new Date();
      let monthYear = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

      return {
        loading: false,

        form: {
          monthYear,
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
      ...mapGetters('SerialNumberStockStore', {
        rs: 'rs',
        rowActive: 'rowActive',
      }),

    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
      if (this.rs.length <= 0)
        this.refreshData();
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_mapActions">
      ************************/
      ...mapActions('SerialNumberStockStore', {
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
