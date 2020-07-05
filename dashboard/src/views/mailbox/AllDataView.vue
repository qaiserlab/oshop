<template>
  <main-layout>

    <section class="content-header">
      <h1>
        Kota Surel
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li class="active">
          Kota Surel
        </li>
      </ol>
    </section>

    <section class="content">

      <ui-panel title="List" :loading="loading" icon="table">

        <ui-row form-group>
          <ui-col size="md-12">

            <ui-datepicker v-model="form.fromDate"
            style="display: inline-block"></ui-datepicker>
            <ui-datepicker v-model="form.toDate"
            style="display: inline-block">s/d</ui-datepicker>

          </ui-col>
        </ui-row>

        <ui-row form-group>
          <ui-col size="md-12">

            <v-client-table :data="rs" :columns="['subjek', 'tanggal', 'aksi']">
              <template slot="aksi" scope="props">
                <div>
                  <ui-link :href="'#/mailbox/edit-data/' + props.row._id" icon="edit">Lihat</ui-link>
                  <ui-link @click="moveData(props.row._id); deleteDialog = true" icon="close">Hapus</ui-link>
                </div>
              </template>
            </v-client-table>

          </ui-col>
        </ui-row>

      </ui-panel>
    </section>

    <ui-buttonbar>
      <ui-button bs-type="success" @click="refreshData" :loading="loading" icon="refresh"></ui-button>
    </ui-buttonbar>

    <ui-modal @close="deleteDialog = false" :display="deleteDialog" title="Konfirmasi" icon="question">
      <div slot="message">Hapus data "{{ rowActive.title }}"?</div>
      <div slot="buttonbar">
        <ui-button @click="removeData">OK</ui-button>
        <ui-button @click="deleteDialog = false" bs-type="danger">Batal</ui-button>
      </div>
    </ui-modal>

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
      dFromDate.setMonth(dFromDate.getMonth() - 1)
      let fromDate = dFromDate.getFullYear() + '-' + (dFromDate.getMonth() + 1) + '-' + dFromDate.getDate();

      let dToDate = new Date();
      let toDate = dToDate.getFullYear() + '-' + (dToDate.getMonth() + 1) + '-' + dToDate.getDate();

      return {
        loading: false,
        deleteDialog: false,

        form: {
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
      ...mapGetters('MailboxStore', {
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
      ...mapActions('MailboxStore', {
        fetchData: 'fetchData',
        deleteData: 'deleteData',
        moveData: 'moveData',
      }),

      /************************
      <id="_removeData">
      ************************/
      removeData() {
        this.deleteDialog = false;
        this.deleteData();
      },

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
