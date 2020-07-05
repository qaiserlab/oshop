<template>
  <main-layout>

    <section class="content-header">
      <h1>
        Halaman
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li class="active">
          Halaman
        </li>
      </ol>
    </section>

    <section class="content">

      <ui-panel title="List" :loading="loading" icon="table">

        <ui-row form-group>
          <ui-col size="md-1">Template</ui-col>
          <ui-col size="md-3">
            <ui-select @input="filterData"
            v-model="form.template"
            :data-source="rsTemplate"></ui-select>
          </ui-col>
        </ui-row>

        <ui-row form-group>
          <ui-col size="md-12">

            <v-client-table :data="rs" :columns="['judul', 'tanggal', 'publikasi', 'aksi']">
              <template slot="aksi" scope="props">
                <div>
                  <ui-link :href="'#/pages/edit-data/' + props.row._id" icon="edit">Ubah</ui-link>
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
      <ui-button href="#/pages/add-new-data" icon="plus"></ui-button>
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
      return {
        loading: false,
        deleteDialog: false,

        form: {
          template: '',
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
      ...mapGetters('TemplateStore', {
        rsTemplate: 'rs',
      }),
      ...mapGetters('PageStore', {
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
      ...mapActions('PageStore', {
        fetchData: 'fetchData',
        deleteData: 'deleteData',
        moveData: 'moveData',
        filterBy: 'filterBy',
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
        this.fetchData().then(result => {
          this.form.template = '';
          this.loading = false;
        });
      },

      /************************
      <id="_filterData">
      ************************/
      filterData() {
        this.filterBy({
          template: this.form.template,
        });
      },


    },

  }
</script>
