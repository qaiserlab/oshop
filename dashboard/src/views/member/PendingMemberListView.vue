<template>
  <main-layout>
    <ui-splash :display="splash">{{ splashMessage }}</ui-splash>

    <section class="content-header">
      <h1>
        Member Pending
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li class="active">
          Member Pending
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

                  <ui-link @click="moveData(props.row._id); confirmDialog = true"
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

    <ui-modal @close="confirmDialog = false" :display="confirmDialog" title="Konfirmasi" icon="question">
      <div slot="message">Aktifasi "{{ rowActive.fullName }}"?</div>
      <div slot="buttonbar">
        <ui-button @click="confirmData" :loading="confirmLoading">Aktifasi</ui-button>
        <ui-button @click="confirmDialog = false" bs-type="danger">Batal</ui-button>
      </div>
    </ui-modal>

    <ui-buttonbar>
      <ui-button @click="exportToExcel" icon="file-excel-o" bs-type="success"></ui-button>
    </ui-buttonbar>

  </main-layout>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import XLSX from 'xlsx';

  export default {

    /************************
    <id="_data">
    ************************/
    data() {
      return {
        loading: false,
        confirmDialog: false,
        confirmLoading: false,
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
        rs: 'rsPremiumPending',
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
      <id="_confirmData">
      ************************/
      confirmData() {
        this.confirmLoading = true;

        let data = this.rowActive;
        data.activation = 'Active';

        this.updateData(data).then(result => {

          this.confirmLoading = false;

          this.splashMessage = `${this.rowActive.fullName} telah diaktifkan`;
          this.splash = true;

          setTimeout(() => {
            this.splash = false;
          }, 2000);

          this.confirmDialog = false;
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

      /************************
      <id="_exportToExcel">
      ************************/
      exportToExcel() {
        let data = [
          [ "Username", "Nama Lengkap", "Email", "No. Telp", "Alamat", "Tanggal Bergabung" ],
        ];

        this.rs.forEach(row => {
          data.push([
            row.username,
            row.nama_Lengkap,
            row.email,
            row.phoneNumber,
            row.address,
            row.tanggal,
          ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(data);
        let wscols = [
          {wch:10},
          {wch:22},
          {wch:25},
          {wch:13},
          {wch:100},
          {wch:15},
        ];

        ws['!cols'] = wscols;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        /* generate file and send to client */
        XLSX.writeFile(wb, "member-aktif.xlsx");
      },
    }
  }
</script>
