<template>
  <main-layout>
    <ui-splash :display="splash">{{ result.message }}</ui-splash>

    <section class="content-header">
      <h1>
        Order Dikonfirmasi
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li>
          <a href="#/member-confirmed-order/all-data">
            Order Dikonfirmasi
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
                <div class="label label-primary">
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
                <b>Pemesan:</b>
                {{ rowActive.memberName }}
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
                        <i class="fa fa-square" :style="{color: row.selectedGroup.color}"></i>
                      </td>
                      <td>{{ row.selectedGroup.size }}</td>
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

            <ui-row v-if="rowActive.shipmentCost_" form-group>
              <ui-col size="md-offset-6 md-3" style="text-align: right">
                <b>Biaya Pengiriman</b>
              </ui-col>
              <ui-col size="md-3">
                {{ rowActive.shipmentCost_ }}
              </ui-col>
            </ui-row>
            <ui-row v-if="rowActive.uniqueCode" form-group>
              <ui-col size="md-offset-6 md-3" style="text-align: right">
                <b>Kode Unik</b>
              </ui-col>
              <ui-col size="md-3">
                {{ rowActive.uniqueCode }}
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-offset-6 md-3" style="text-align: right">
                <b>Total</b>
              </ui-col>
              <ui-col size="md-3">
                {{ rowActive.total_ }}
              </ui-col>
            </ui-row>

          </ui-panel>

          <ui-panel title="Data Konfirmasi" icon="edit">
            <ui-row form-group>
              <ui-col size="md-offset-2 md-4">
                <b>Bank Pengirim:</b><br>
                {{ rowActive.confirm.bankSender }}
              </ui-col>

              <ui-col size="md-6">
                <b>Bank Tujuan:</b><br>
                {{ rowActive.confirm.bankDestination }}
              </ui-col>
            </ui-row>
            <ui-row form-group>
              <ui-col size="md-offset-2 md-4">
                <b>Jumlah Transfer:</b><br>
                {{ rowActive.confirm.amount_ }}
              </ui-col>

              <ui-col size="md-6">
                <b>Tanggal:</b><br>
                {{ rowActive.confirm.confirmDate_ }}
              </ui-col>
            </ui-row>
          </ui-panel>

          <ui-panel title="Alamat" icon="edit">
            <ui-row form-group>
              <ui-col size="md-4">
                <b>Nama:</b><br>
                {{ rowActive.firstName }} {{ rowActive.lastName }}
              </ui-col>

              <ui-col size="md-8">
                <b>Alamat:</b><br>
                {{ rowActive.address }}
              </ui-col>

            </ui-row>
            <ui-row form-group>
              <ui-col size="md-4">
                <b>Provinsi:</b><br>
                {{ rowActive.province }}
              </ui-col>
              <ui-col size="md-4">
                <b>Kota/Kabupaten:</b><br>
                {{ rowActive.city }}
              </ui-col>

              <ui-col size="md-4">
                <b>Kecamatan:</b><br>
                {{ rowActive.district }}
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-4">
                <b>Kode Pos:</b><br>
                {{ rowActive.postalCode }}
              </ui-col>
              <ui-col size="md-4">
                <b>No. Telp:</b><br>
                {{ rowActive.phoneNumber }}
              </ui-col>
            </ui-row>
          </ui-panel>

          <ui-panel v-if="rowActive.dropship.isDropship" title="Alamat (Dropship)" icon="edit">
            <ui-row form-group>

              <ui-col size="md-4">
                <b>Nama:</b><br>
                {{ rowActive.dropship.firstName }} {{ rowActive.dropship.lastName }}
              </ui-col>

              <ui-col size="md-8">
                <b>Alamat:</b><br>
                {{ rowActive.dropship.address }}
              </ui-col>

            </ui-row>
            <ui-row form-group>
              <ui-col size="md-4">
                <b>Provinsi:</b><br>
                {{ rowActive.dropship.province }}
              </ui-col>
              <ui-col size="md-4">
                <b>Kota/Kabupaten:</b><br>
                {{ rowActive.dropship.city }}
              </ui-col>

              <ui-col size="md-4">
                <b>Kecamatan:</b><br>
                {{ rowActive.dropship.district }}
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-4">
                <b>Kode Pos:</b><br>
                {{ rowActive.dropship.postalCode }}
              </ui-col>
              <ui-col size="md-4">
                <b>No. Telp:</b><br>
                {{ rowActive.dropship.phoneNumber }}
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
      <ui-button href="#/member-confirmed-order/all-data"
      bs-type="danger"
      icon="arrow-left"></ui-button>
      <ui-button @click="changeState" :loading="loading" icon="check"></ui-button>
      <ui-button
      @click="printInvoice"
      bs-type="success"
      icon="print"></ui-button>
      <ui-button
      @click="printLabel"
      bs-type="success"
      icon="address-card-o"></ui-button>
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
      ...mapGetters('MemberOrderStore', {
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
      ...mapActions('MemberOrderStore', {
        moveData: 'moveData',
        setState: 'setState',
      }),

      /************************
      <id="_invoiceLink">
      ************************/
      invoiceLink(state, _id) {
        if (state == 'Pending') state = 'New';
        return '#/member-' + state.toLowerCase() + '-order/view-data/' + _id;
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
          case 'Delivered':
            color = 'success';
            break;
          case 'Paid':
            color = 'warning';
        }

        return color;
      },

      /************************
      <id="_changeState">
      ************************/
      changeState() {
        this.loading = true;

        let data = {
          status: 'Paid',
        };

        this.setState(data).then(result => {

          this.loading = false;
          this.result = result;

          this.splash = true;

          setTimeout(() => {
            this.splash = false;
            this.$router.push('/member-confirmed-order/all-data');
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
                  style="background-color: ${row.selectedGroup.color}; display: block">
                    ${row.selectedGroup.color}
                  </div>
                </td>
                <td>${row.selectedGroup.size}</td>
                <td>${row.price_}</td>
                <td>${row.qty}</td>
                <td>${row.subTotal_}</td>
              </tr>
            </tbody>
          `;
        });

        cartHtml += `</table>`;

        if (this.form.resi) {
          var resiHtml = `
          <tr>
            <td style="text-align: right"><b>No. Resi</b></td>
            <td>:</td>
            <td>${this.form.resi}</td>
          </tr>
          `;
        }
        else var resiHtml = '';

        var confirmHtml = `
        <h2>Data Konfirmasi</h2>
        <hr>
        <table class="address">
          <tr>
            <td><b>Bank Pengirim</b></td>
            <td>:</td>
            <td>${this.rowActive.confirm.bankSender}</td>
            <td><b>Bank Tujuan</b></td>
            <td>:</td>
            <td>${this.rowActive.confirm.bankDestination}</td>
          </tr>
          <tr>
            <td><b>Jumlah Transfer</b></td>
            <td>:</td>
            <td>${this.rowActive.confirm.amount_}</td>
            <td><b>Tanggal</b></td>
            <td>:</td>
            <td>${this.rowActive.confirm.confirmDate_}</td>
          </tr>
        </table>
        `;

        var addressHtml = `
        <h2>Alamat</h2>
        <hr>
        <table class="address">
          <tr>
            <td><b>Nama</b></td>
            <td>:</td>
            <td>${this.rowActive.firstName} ${this.rowActive.lastName}</td>
            <td><b>Alamat</b></td>
            <td>:</td>
            <td colspan="4">${this.rowActive.address}</td>
          </tr>
          <tr>
            <td><b>Provinsi</b></td>
            <td>:</td>
            <td>${this.rowActive.province}</td>
            <td><b>Kota/Kabupaten</b></td>
            <td>:</td>
            <td>${this.rowActive.city}</td>
            <td><b>Kecamatan</b></td>
            <td>:</td>
            <td>${this.rowActive.district}</td>
          </tr>
          <tr>
            <td><b>Kode Pos</b></td>
            <td>:</td>
            <td>${this.rowActive.postalCode}</td>
            <td><b>No. Telp</b></td>
            <td>:</td>
            <td>${this.rowActive.phoneNumber}</td>
          </tr>
        </table>
        `;

        if (this.rowActive.dropship.isDropship) {
          var dropshipHtml = `
          <h2>Alamat (Dropship)</h2>
          <hr>
          <table class="address">
            <tr>
              <td><b>Nama</b></td>
              <td>:</td>
              <td>${this.rowActive.dropship.firstName} ${this.rowActive.dropship.lastName}</td>
              <td><b>Alamat</b></td>
              <td>:</td>
              <td colspan="4">${this.rowActive.dropship.address}</td>
            </tr>
            <tr>
              <td><b>Provinsi</b></td>
              <td>:</td>
              <td>${this.rowActive.dropship.province}</td>
              <td><b>Kota/Kabupaten</b></td>
              <td>:</td>
              <td>${this.rowActive.dropship.city}</td>
              <td><b>Kecamatan</b></td>
              <td>:</td>
              <td>${this.rowActive.dropship.district}</td>
            </tr>
            <tr>
              <td><b>Kode Pos</b></td>
              <td>:</td>
              <td>${this.rowActive.dropship.postalCode}</td>
              <td><b>No. Telp</b></td>
              <td>:</td>
              <td>${this.rowActive.dropship.phoneNumber}</td>
            </tr>
          </table>
          `;
        }
        else var dropshipHtml = '';

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
                <td>${this.rowActive.fullName}</td>
              </tr>
            </table>

            <br>
            ${cartHtml}

            <table class="total">
              <tr>
                <td style="text-align: right"><b>Biaya Pengiriman</b></td>
                <td>:</td>
                <td>${this.rowActive.shipmentCost_}</td>
              </tr>
              <tr>
                <td style="text-align: right"><b>Kode Unik</b></td>
                <td>:</td>
                <td>${this.rowActive.uniqueCode}</td>
              </tr>
              <tr>
                <td style="text-align: right"><b>Total</b></td>
                <td>:</td>
                <td>${this.rowActive.total_}</td>
              </tr>
              ${resiHtml}
            </table>

            ${confirmHtml}
            ${addressHtml}
            ${dropshipHtml}

            <script>window.print()
            `);
        });
      },

      /************************
      <id="_printLabel">
      ************************/
      printLabel() {
        let $iframe = $('<iframe>').hide().appendTo('body');

        var shipmentHtml = '';

        if (this.rowActive.shipment) {
          if (this.rowActive.shipment.courier) {
            shipmentHtml = '<br>' + this.rowActive.shipment.courier;
            if (this.rowActive.shipment.service)
            shipmentHtml += ' ' + this.rowActive.shipment.service;
          }
        }

        var addressHtml = `
        <table style="border: solid black 1px; width: 100%">
        <tr>
          <th colspan="2" style="text-align: right" valign="top">
            Transaksi #${this.rowActive.code}<br>
            ${shipmentHtml}
          </th>
        <tr>
        <tr>
          <td style="border-right: solid black 1px" valign="top">

            <h4>Penerima</h4>
            <table class="address">
              <tr>
                <td><b>Nama</b></td>
                <td>: ${this.rowActive.firstName} ${this.rowActive.lastName}</td>
              </tr>
              <tr>
                <td><b>No. Telp</b></td>
                <td>: ${this.rowActive.phoneNumber}</td>
              </tr>
            </table>

          </td>
          <td valign="top">

          <h4>Penerima</h4>
          <table class="address">
            <tr>
              <td><b>COZMEED INDONESIA</b></td>
            </tr>
            <tr>
              <td><a href="https://cozmeed.id">https://cozmeed.id</a></td>
            </tr>
            <tr>
              <td>P. +62 (271) 679 2754 E. info@cozmeed.id</td>
            </tr>
          </table>

          </td>
        </tr>
        <tr>
          <td colspan="2" valign="top" style="font-size: 11px; text-align: center">
            Terima kasih atas kepercayaan Anda berbelanja di Cozmeed
          </td>
        <tr>
        </table>
        `;
        var label = addressHtml;

        if (this.rowActive.dropship) {
          if (this.rowActive.dropship.isDropship) {
          var dropshipHtml = `
          <table style="border: solid black 1px; width: 100%">
          <tr>
            <th colspan="2" style="text-align: right" valign="top">
              Transaksi #${this.rowActive.code}<br>
              ${shipmentHtml}
            </th>
          <tr>
          <tr>
            <td style="border-right: solid black 1px" valign="top">

              <h4>Penerima</h4>
              <table class="address">
                <tr>
                  <td><b>Nama</b></td>
                  <td>: ${this.rowActive.dropship.firstName} ${this.rowActive.dropship.lastName}</td>
                </tr>
                <tr>
                  <td><b>No. Telp</b></td>
                  <td>: ${this.rowActive.dropship.phoneNumber}</td>
                </tr>
              </table>

            </td>
            <td valign="top">

              <h4>Penerima</h4>
              <table class="address">
                <tr>
                  <td><b>Nama</b></td>
                  <td>: ${this.rowActive.firstName} ${this.rowActive.lastName}</td>
                </tr>
                <tr>
                  <td><b>No. Telp</b></td>
                  <td>: ${this.rowActive.phoneNumber}</td>
                </tr>
                <tr>
                  <td valign="top"><b>Alamat</b></td>
                  <td valign="top">: ${this.rowActive.address}
                    <br>&nbsp;&nbsp;${this.rowActive.province}
                    <br>&nbsp;&nbsp;${this.rowActive.city}
                    <br>&nbsp;&nbsp;${this.rowActive.district} - ${this.rowActive.postalCode}
                  </td>
                </tr>
              </table>

            </td>
          </tr>
          <tr>
            <td colspan="2" valign="top" style="font-size: 11px; text-align: center">
              Terima kasih atas kepercayaan Anda berbelanja di Cozmeed
            </td>
          <tr>
          </table>
          `;
          label = dropshipHtml;
        }
        }

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

            ${label}

            <script>window.print()
            `);
        });
      },

    },

  }
</script>
