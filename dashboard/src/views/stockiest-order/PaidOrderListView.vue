<template>
  <main-layout>

    <section class="content-header">
      <h1>
        Paid Order
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li class="active">
          Paid Order
        </li>
      </ol>
    </section>

    <section class="content">

      <ui-panel title="List" :loading="loading" icon="table">

        <ui-row form-group>
          <ui-col size="md-12">

            <!-- <v-client-table :data="rs" :columns="['code', 'member', 'shipTo', 'shippingAddress', 'totalItems', 'total_', 'isDropship', 'orderDate_', 'dueDate_', 'status', 'aksi']"> -->
            <v-client-table :data="rs" :columns="['invoice']">
              <template slot="invoice" scope="props">
                <div style="float: left">
                  <b>Member:</b> {{ props.row.member }}<br>
                  <br>
                  <b>Ship To:</b> {{ props.row.shipTo }}<br>
                  <b>Shipping Address:</b> {{ props.row.shippingAddress }}<br><br>
                  <b>Total Qty:</b> {{ props.row.totalItems }}<br>
                  <b>Total:</b> {{ props.row.total_ }}<br>
                </div>

                <div style="float: right">
                  <ui-link :href="'#/paid-order/view-data/' + props.row._id">
                    {{ props.row.code }}
                  </ui-link><br>
                  <b>Tanggal Order:</b> {{ props.row.orderDate_ }} -
                  <b>Tanggal Expire:</b> {{ props.row.dueDate_ }}<br>
                  <b>Is Dropship:</b> {{ props.row.isDropship }}<br><br>
                  <div class="label label-warning">
                    {{ props.row.status }}
                  </div><br><br>
                  <ui-link @click="moveData(props.row._id); deleteDialog = true"
                  icon="close"
                  style="float: right; color: darkred">
                    Delete
                  </ui-link>
                </div>
              </template>

              <!-- <template slot="code" scope="props">
                <ui-link :href="'#/paid-order/view-data/' + props.row._id">
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
      };
    },

    /************************
    <id="_computed">
    ************************/
    computed: {

      /************************
      <id="_mapGetters">
      ************************/
      ...mapGetters('StockiestOrderStore', {
        rs: 'rsPaid',
        rowActive: 'rowActive',
      }),

    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_mapActions">
      ************************/
      ...mapActions('StockiestOrderStore', {
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
