<template>
  <main-layout>

    <section class="content-header">
      <h1>
        Isi Ulang PIN
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li class="active">
          Isi Ulang PIN
        </li>
      </ol>
    </section>

    <section class="content">

      <ui-panel title="List" :loading="loading" icon="table">

        <ui-row form-group>
          <ui-col size="md-12">

            <v-client-table :data="rs" :columns="['serial_Number', 'pin', 'sponsor_ID', 'aksi']">
              <template slot="aksi" scope="props">
                <div>
                  <ui-link @click="moveData(props.row._id); deleteDialog = true"
                  icon="close" v-if="!props.row.isActive">Hapus</ui-link>
                  <span v-else
                  class="badge danger"
                  style="float: left; background: grey">
                    <i class="fa fa-lock"></i>
                    Active
                  </span>
                </div>
              </template>
            </v-client-table>

          </ui-col>
        </ui-row>

      </ui-panel>
    </section>

    <ui-buttonbar>
      <ui-button bs-type="success" @click="refreshData" :loading="loading" icon="refresh"></ui-button>
      <ui-button href="#/pin/add-new-data" icon="plus"></ui-button>
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
      };
    },

    /************************
    <id="_computed">
    ************************/
    computed: {

      /************************
      <id="_mapGetters">
      ************************/
      ...mapGetters('PinStore', {
        rs: 'rs',
        rowActive: 'rowActive',
      }),

    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
      // if (this.rs.length <= 0)
        this.refreshData();
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_mapActions">
      ************************/
      ...mapActions('PinStore', {
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
        this.fetchData().then(result => {
          this.loading = false;
        });
      },

    },

  }
</script>
