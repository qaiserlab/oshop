<template>
  <main-layout>
    <ui-splash :display="splash">{{ result.message }}</ui-splash>

    <section class="content-header">
      <h1>
        Withdraw
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li class="active">
          Withdraw
        </li>
      </ol>
    </section>

    <section class="content">
      <ui-alert :data-source="result.data"
      :display="result.state == 'invalid'"
      @close="result.state = ''">
        {{ result.message }}
      </ui-alert>


      <ui-panel title="List" :loading="loading" icon="table">

        <ui-row form-group>
          <ui-col size="md-12">

            <ui-table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Nama Lengkap</th>
                  <th>Rekening</th>
                  <!-- <th>Pertumbuhan Jaringan</th>
                  <th>Insentif Prestasi</th>
                  <th>Kode Unik</th>
                  <th>Insentif Penjualan</th> -->
                  <th>Total Cashback</th>
                  <th>Pilih</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(withdraw, i) in rs">
                  <td>{{ withdraw.memberId }}</td>
                  <td>{{ withdraw.member.fullName }}</td>
                  <td>{{ withdraw.member.bankAccount }}</td>
                  <!-- <td>{{ withdraw.pertumbuhanJaringan }}</td>
                  <td>{{ withdraw.insentifPrestasi }}</td>
                  <td>{{ withdraw.kodeUnik }}</td>
                  <td>{{ withdraw.insentifPenjualan }}</td> -->
                  <td>{{ withdraw.saldo_ }}</td>
                  <td>
                    <input v-model="idxs" type="checkbox" :value="i">
                  </td>
                </tr>
              </tbody>
            </ui-table>

          </ui-col>
        </ui-row>

      </ui-panel>
    </section>

    <ui-buttonbar>
      <ui-button bs-type="success" @click="refreshData" :loading="loading" icon="refresh"></ui-button>
      <ui-button @click="withdraw" :loading="withdrawLoading" icon="paper-plane"></ui-button>
    </ui-buttonbar>

    <ui-modal @close="resultDialog = false" :display="resultDialog" title="Informasi" icon="information">
      <div slot="message">
        Berikut ini list member yg uangnya telah di withdraw;

        <ui-table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Nama Lengkap</th>
              <th>Rekening</th>
              <!-- <th>Pertumbuhan Jaringan</th>
              <th>Insentif Prestasi</th>
              <th>Kode Unik</th>
              <th>Insentif Penjualan</th> -->
              <th>Total Cashback</th>
              <th>Pilih</th>
            </tr>
          </thead>
          <tbody v-if="result.data.rsMember">
            <tr v-for="(withdraw, i) in result.data.rsMember">
              <td>{{ withdraw.memberId }}</td>
              <td>{{ withdraw.member.fullName }}</td>
              <td>{{ withdraw.member.bankAccount }}</td>
              <!-- <td>{{ withdraw.pertumbuhanJaringan }}</td>
              <td>{{ withdraw.insentifPrestasi }}</td>
              <td>{{ withdraw.kodeUnik }}</td>
              <td>{{ withdraw.insentifPenjualan }}</td> -->
              <td>{{ withdraw.saldo_ }}</td>
            </tr>
          </tbody>
        </ui-table>
      </div>
      <div slot="buttonbar">
        <ui-button @click="resultDialog = false" bs-type="danger">Tutup</ui-button>
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
        splash: false,
        loading: false,
        withdrawLoading: false,
        resultDialog: false,

        result: {
          state: '',
          message: '',
          data: {},
        },

        idxs: [],
      };
    },

    /************************
    <id="_computed">
    ************************/
    computed: {

      /************************
      <id="_mapGetters">
      ************************/
      ...mapGetters('WithdrawStore', {
        rs: 'rs',
        rowActive: 'rowActive',
      }),

      /************************
      <id="_rs_">
      ************************/
      rs_() {
        return this.idxs.map(idx => this.rs[idx]);
      },

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
      ...mapActions('WithdrawStore', {
        fetchData: 'fetchData',
        createData: 'createData',
        moveData: 'moveData',
      }),

      /************************
      <id="_removeData">
      ************************/
      removeData() {
        this.resultDialog = false;
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

      /************************
      <id="_withdraw">
      ************************/
      withdraw() {
        this.withdrawLoading = true;

        this.createData({ rsMember: this.rs_ }).then(result => {
          this.withdrawLoading = false;
          this.result = result;

          this.idxs = [];

          this.refreshData();
          this.splash = true;
          this.resultDialog = true;

          setTimeout(() => {
            this.splash = false;
          }, 1500);
        }).catch(result => {
          this.withdrawLoading = false;
          this.result = result;
        });
      },

    },

  }
</script>
