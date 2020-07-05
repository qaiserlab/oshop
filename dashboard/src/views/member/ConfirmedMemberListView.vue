<template>
  <main-layout>
    <ui-splash :display="splash">{{ splashMessage }}</ui-splash>

    <section class="content-header">
      <h1>
        Member Terkonfirmasi
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li class="active">
          Member Terkonfirmasi
        </li>
      </ol>
    </section>

    <section class="content">

      <ui-panel title="List" :loading="loading" icon="table">

        <ui-row form-group>
          <ui-col size="md-12">

            <v-client-table :data="rs"
            :columns="['username', 'nama_Lengkap', 'tanggal', 'aksi']"
            :options="{
              filterByColumn: true,
              filterable: ['username', 'nama_Lengkap', 'tanggal'],
            }">
              <template slot="aksi" scope="props">
                <div>
                  <ui-link :href="'#/member/view-data/' + props.row._id"
                  icon="eye">View</ui-link>

                  <ui-link @click="moveData(props.row._id); activateDialog = true"
                  icon="toggle-on">Aktifasi</ui-link>
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

    <ui-modal @close="activateDialog = false" :display="activateDialog" title="Konfirmasi" icon="question">
      <div slot="message">Aktifasi "{{ rowActive.fullName }}"?</div>
      <div slot="buttonbar">
        <ui-button @click="activateData" :loading="activateLoading">Aktifasi</ui-button>
        <ui-button @click="activateDialog = false" bs-type="danger">Batal</ui-button>
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
        activateDialog: false,
        activateLoading: false,
        splash: false,
        splashMessage: '',
      };
    },

    /************************
    <id="_computed">
    ************************/
    computed: {

      /************************
      <id="_mapGetters">
      ************************/
      ...mapGetters('MemberStore', {
        rs: 'rsPremiumConfirmed',
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
      ...mapActions('MemberStore', {
        fetchData: 'fetchData',
        moveData: 'moveData',
        updateData: 'updateData',
        deleteData: 'deleteData',
      }),

      /************************
      <id="_activateData">
      ************************/
      activateData() {
        this.activateLoading = true;

        let data = this.rowActive;
        data.activation = 'Active';

        this.updateData(data).then(result => {

          this.activateLoading = false;

          this.splashMessage = `${this.rowActive.fullName} telah diaktifkan`;
          this.splash = true;

          setTimeout(() => {
            this.splash = false;
          }, 2000);

          this.activateDialog = false;
          this.refreshData();
        });
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
