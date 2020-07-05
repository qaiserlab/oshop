<template>
  <main-layout>

    <section class="content-header">
      <h1>
        Order Baru
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li class="active">
          Order Baru
        </li>
      </ol>
    </section>

    <section class="content">

      <ui-panel title="List" :loading="loading" icon="table">

        <ui-row form-group>
          <ui-col size="md-11">
            <ui-textbox v-model="form.keyword" placeholder="Masukan Nomor Invoice..."></ui-textbox>
          </ui-col>
          <ui-col size="md-1">
            <ui-button @click="form.keyword = ''">Reset</ui-button>
          </ui-col>
        </ui-row>

        <ui-row form-group>
          <ui-col size="md-12">

            <!-- <v-client-table :data="rs" :columns="['code', 'member', 'shipTo', 'shippingAddress', 'totalItems', 'total_', 'isDropship', 'orderDate_', 'dueDate_', 'status', 'aksi']"> -->
            <v-client-table :data="rs_"
            :columns="['invoice']"
            :options="{ filterable: false }">
              <template slot="invoice" scope="props">
                <div style="float: left">
                  <b>Username:</b> {{ props.row.memberId }}<br>
                  <b>Pemesan:</b> {{ props.row.fullName }}<br>
                  <br>
                  <b>Total Qty:</b> {{ props.row.totalItems }}<br>
                  <b>Total:</b> {{ props.row.total_ }}<br>
                </div>

                <div style="float: right">
                  <ui-link :href="'#/member-new-order/view-data/' + props.row._id">
                    {{ props.row.code }}
                  </ui-link><br>
                  <b>Tanggal Order:</b> {{ props.row.orderDate_ }} -
                  <b>Tanggal Expire:</b> {{ props.row.dueDate_ }}<br>
                  <br>
                  <div class="label label-danger">
                    {{ props.row.status }}
                  </div><br><br>
                  <ui-link @click="moveData(props.row._id); deleteDialog = true"
                  icon="close"
                  style="float: right">
                    Delete
                  </ui-link>
                </div>
              </template>

              <!-- <template slot="code" scope="props">
                <ui-link :href="'#/member-new-order/view-data/' + props.row._id">
                  {{ props.row.code }}
                </ui-link>
              </template> -->
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
      return {
        loading: false,
        deleteDialog: false,
        form: { keyword: '' },
      };
    },

    /************************
    <id="_computed">
    ************************/
    computed: {

      /************************
      <id="_mapGetters">
      ************************/
      ...mapGetters('MemberOrderStore', {
        rs: 'rsPending',
        rowActive: 'rowActive',
      }),

      /************************
      <id="_rs_">
      ************************/
      rs_() {
        if (!this.form.keyword) return this.rs;

        return this.rs.filter(row => {
          return row.code.toUpperCase() == this.form.keyword.trim().toUpperCase();
        });
      },

    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_mapActions">
      ************************/
      ...mapActions('MemberOrderStore', {
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
          this.loading = false;
        });
      },

    },

  }
</script>
