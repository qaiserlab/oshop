<template>
  <main-layout>
    <ui-splash :display="splash">{{ result.message }}</ui-splash>

    <section class="content-header">
      <h1>
        Order Diproses
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li>
          <a href="#/processed-order/all-data">
            Order Diproses
          </a>
        </li>
        <li class="active">
          Invoice
        </li>
      </ol>
    </section>

    <section class="content">
      <ui-alert :data-source="result.data"
      :display="result.state == 'invalid'"
      @close="result.state = ''">
        {{ result.message }}
      </ui-alert>

      <ui-row>
        <ui-col size="md-9">

          <ui-panel :title="'Invoice ' + rowActive.code" icon="edit">
            <ui-row form-group>
              <ui-col size="md-4">
                <b>Tanggal Order:</b>
                {{ rowActive.orderDate_ }}
              </ui-col>

              <ui-col size="md-4">
                <b>Username:</b>
                {{ rowActive.memberId }}
              </ui-col>

              <ui-col size="md-4">
                <b>Status:</b>
                <div class="label label-success">
                  {{ rowActive.status }}
                </div>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-4">
                <b>Tanggal Expire:</b>
                {{ rowActive.dueDate_ }}
              </ui-col>

              <ui-col size="md-8">
                <b>Member Name:</b>
                {{ rowActive.member.fullName }}
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-12">
                <ui-table type="bordered">
                  <thead>
                    <tr>
                      <th>Produk</th>
                      <th>Warna</th>
                      <th>Ukuran</th>
                      <th>Harga</th>
                      <th>Qty</th>
                      <th>Sub Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="row in rowActive.cart">
                      <td>{{ row.productName }}</td>
                      <td>
                        <i class="fa fa-square" :style="{color: row.color}"></i>
                      </td>
                      <td>{{ row.size }}</td>
                      <td>{{ row.price_ }}</td>
                      <td>{{ row.qty }}</td>
                      <td>{{ row.subTotal_ }}</td>
                    </tr>
                  </tbody>
                </ui-table>
              </ui-col>
            </ui-row>

            <!-- <ui-row form-group>
              <ui-col size="md-6">
                <b>Payment Method:</b><br>
                {{ rowActive.paymentMethod }}
              </ui-col>
              <ui-col size="md-3" style="text-align: right">
                <b>Sub total</b>
              </ui-col>
              <ui-col size="md-3">
                {{ rowActive.subTotal_ }}
              </ui-col>
            </ui-row> -->
            <!-- <ui-row form-group>
              <ui-col size="md-offset-6 md-3" style="text-align: right">
                <b>Biaya Pengiriman</b>
              </ui-col>
              <ui-col size="md-3">
                {{ rowActive.shipmentCost_ }}
              </ui-col>
            </ui-row>
            <ui-row form-group>
              <ui-col size="md-offset-6 md-3" style="text-align: right">
                <b>Kode Unik</b>
              </ui-col>
              <ui-col size="md-3">
                {{ rowActive.uniqueCode }}
              </ui-col>
            </ui-row> -->
            <ui-row form-group>
              <ui-col size="md-offset-6 md-3" style="text-align: right">
                <b>Total</b>
              </ui-col>
              <ui-col size="md-3">
                {{ rowActive.total_ }}
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-offset-6 md-3" style="text-align: right">
                <b>No. Resi</b>
              </ui-col>
              <ui-col size="md-3">
                <ui-textbox v-model="form.resi"></ui-textbox>
              </ui-col>
            </ui-row>

          </ui-panel>

        </ui-col>
        <ui-col size="md-3">

          <ui-panel title="10 Order Terakhir" icon="edit">
            <ui-row v-for="rowOrder in rsLatestOrder" form-group>
              <ui-col size="md-12">

                <a :href="invoiceLink(rowOrder.status, rowOrder._id)" class="latest-order">
                  <b>Invoice {{ rowOrder.code }}</b>
                  <br>
                  <sup>{{ rowOrder.orderDate_ }}</sup>
                  <br>
                  {{ rowOrder.total_ }}
                  <span class="label" :class="'label-' + stateColor(rowOrder.status)" style="float: right">
                    {{ rowOrder.status }}
                  </span>
                  <hr>
                </a>

              </ui-col>
            </ui-row>
          </ui-panel>

        </ui-col>

      </ui-row>
    </section>

    <ui-buttonbar>
      <ui-button href="#/processed-order/all-data"
      bs-type="danger"
      icon="arrow-left"></ui-button>
      <ui-button @click="deliver" :loading="loading" icon="check"></ui-button>
      <ui-button
      @click="printInvoice"
      bs-type="success"
      icon="print"></ui-button>
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
      return {
        loading: false,
        splash: false,

        result: {
          state: '',
          message: '',
          data: {},
        },

        form: {
          code: '',
          orderDate: '',
          dueDate: '',
          featuredImage: '',
          template: '',
          resi: '',
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
      ...mapGetters('PublicationStore', {
        rsPublication: 'rs',
      }),
      ...mapGetters('TemplateStore', {
        rsTemplate: 'rs',
      }),
      ...mapGetters('StockiestOrderStore', {
        rowActive: 'rowActive',
        rsLatestOrder: 'rsLatestOrder',
      }),

    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
      this.moveData(this.$route.params.id);

      this.form.code = this.rowActive.code;
      this.form.orderDate = this.rowActive.orderDate;
      this.form.dueDate = this.rowActive.dueDate;
      this.form.featuredImage = this.rowActive.featuredImage;
      this.form.template = this.rowActive.template;
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_mapActions">
      ************************/
      ...mapActions('StockiestOrderStore', {
        moveData: 'moveData',
        setState: 'setState',
      }),

      /************************
      <id="_invoiceLink">
      ************************/
      invoiceLink(state, _id) {
        return '#/' + state.toLowerCase() + '-order/view-data/' + _id;
      },

      /************************
      <id="_stateColor">
      ************************/
      stateColor(state) {
        let color = 'default';

        switch (state) {
          case 'Pending':
            color = 'danger';
            break;
          case 'Confirmed':
            color = 'primary';
            break;
          case 'Processed':
            color = 'success';
            break;
          case 'Paid':
            color = 'warning';
        }

        return color;
      },

      /************************
      <id="_deliver">
      ************************/
      deliver() {
        this.loading = true;

        let data = {
          status: 'Delivered',
          resi: this.form.resi,
        };

        this.setState(data).then(result => {

          this.loading = false;
          this.result = result;

          this.splash = true;

          setTimeout(() => {
            this.splash = false;
            this.$router.push('/processed-order/all-data');
          }, 2000);

        }).catch(result => {

          this.loading = false;
          this.result = result;

        });
      },

      /************************
      <id="_printInvoice">
      ************************/
      printInvoice() {
        let $iframe = $('<iframe>').hide().appendTo('body');

        let cartHtml = `
        <table class="cart" cellpading="0" cellspacing="0">
        <thead>
          <tr>
            <th>Produk</th>
            <th>Warna</th>
            <th>Ukuran</th>
            <th>Harga</th>
            <th>Qty</th>
            <th>Sub Total</th>
          </tr>
        </thead>`;

        this.rowActive.cart.forEach(row => {
          cartHtml += `
            <tbody>
              <tr>
                <td>${row.productName}</td>
                <td>
                  <div
                  style="background-color: ${row.color}; display: block">
                    ${row.color}
                  </div>
                </td>
                <td>${row.size}</td>
                <td>${row.price_}</td>
                <td>${row.qty}</td>
                <td>${row.subTotal_}</td>
              </tr>
            </tbody>
          `;
        });

        cartHtml += `</table>`;

        $iframe.ready(() => {
          $iframe.contents().find('body').append(`
            <style>
              * {
                font-family: tahoma;
              }

              td, th {
                padding: 4px;
              }

              .cart {
                width: 100%;
                border: solid black 1px;
              }

              .total {
                width: 100%;
              }

              .total td:first-child {
                width: 550px;
              }

              .cart th {
                text-align: left;
              }

              .cart th, .cart td {
                border-bottom: solid black 1px;
              }

              .address {
                font-size: 11px;
              }
            </style>

            <h1>Invoice ${this.rowActive.code}</h1>

            <table>
              <tr>
                <td><b>Tanggal Order</b></td>
                <td>:</td>
                <td>${this.rowActive.orderDate_}</td>
                <td><b>Username</b></td>
                <td>:</td>
                <td>${this.rowActive.memberId}</td>
                <td><b>Status</b></td>
                <td>:</td>
                <td>${this.rowActive.status}</td>
              </tr>
              <tr>
                <td><b>Tanggal Expire</b></td>
                <td>:</td>
                <td>${this.rowActive.dueDate_}</td>
                <td><b>Pemesan</b></td>
                <td>:</td>
                <td>${this.rowActive.member.fullName}</td>
              </tr>
            </table>

            <br>
            ${cartHtml}

            <table class="total">
              <tr>
                <td style="text-align: right"><b>Total</b></td>
                <td>:</td>
                <td>${this.rowActive.total_}</td>
              </tr>
            </table>

            <script>window.print()
            `);
        });
      },

    },

  }
</script>
