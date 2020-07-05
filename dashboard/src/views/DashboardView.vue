<template>
  <main-layout id="DashboardView">

      <section class="content-header">
        <h1>
          Dasbor
        </h1>
        <ol class="breadcrumb">
          <li>
            <a href="#/">
              <i class="fa fa-fw ti-home"></i>
            </a>
          </li>
          <li class="active">
            Dasbor
          </li>
        </ol>
      </section>

      <section class="content">

        <div class="row">
          <div class="col-sm-6 col-md-6 col-lg-3">
            <div class="flip">
              <div class="widget-bg-color-icon card-box front">
                <div class="bg-icon pull-left">
                  <i class="ti-money text-warning"></i>
                </div>
                <div class="text-right">
                  <h3 class="text-dark"><b>Rp{{ rowSetting.pinPrice }}</b></h3>
                  <p>Harga PIN</p>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="widget-bg-color-icon card-box back">
                <div class="text-center">
                  <span id="loadspark-chart"></span>
                  <hr>
                  <p>
                    <a href="#/pin/edit-pin-price">Ubah Harga PIN</a>
                  </p>
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
          </div>

          <div class="col-sm-6 col-md-6 col-lg-3">
            <div class="flip">
              <div class="widget-bg-color-icon card-box front">
                <div class="bg-icon pull-left">
                  <i class="ti-email text-info"></i>
                </div>
                <div class="text-right">
                  <h3 class="text-dark">
                    <b>{{ rsMailbox.length }}</b>
                  </h3>
                  <p>Pesan Masuk</p>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="widget-bg-color-icon card-box back">
                <div class="text-center">
                  <span id="subscribers-chart"></span>
                  <hr>
                  <p>
                    <a href="#/mailbox/all-data">Lihat Kotak Surel</a>
                  </p>
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
          </div>

          <div class="col-sm-6 col-md-6 col-lg-3">
            <div class="flip">
              <div class="widget-bg-color-icon card-box front">
                <div class="bg-icon pull-left">
                  <i class="ti-shopping-cart text-success"></i>
                </div>
                <div class="text-right">
                  <h3 class="text-dark">
                    <b>{{ rsMemberOrder.length }}</b>
                  </h3>
                  <p>Member Order</p>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="widget-bg-color-icon card-box back">
                <div class="text-center">
                  <span id="visitsspark-chart"></span>
                  <hr>
                  <p>
                    <a href="#/member-new-order/all-data">Lihat Member Order</a>
                  </p>
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
          </div>

          <div class="col-sm-6 col-md-6 col-lg-3">
            <div class="flip">
              <div class="widget-bg-color-icon card-box front">
                <div class="bg-icon pull-left">
                  <i class="ti-shopping-cart text-info"></i>
                </div>
                <div class="text-right">
                  <h3>
                    <b id="widget_count3">{{ rsStockiestOrder.length }}</b>
                  </h3>
                  <p>Stokist Order</p>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="widget-bg-color-icon card-box back">
                <div class="text-center">
                  <span class="linechart" id="salesspark-chart"></span>
                  <hr>
                  <p>
                    <a href="#/new-order/all-data">Lihat Stokist Order</a>
                  </p>
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
          </div>

        </div>

      </section>

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
      };
    },

    /************************
    <id="_computed">
    ************************/
    computed: {
      /************************
      <id="_mapGetters">
      ************************/
      ...mapGetters('SettingStore', {
        rowSetting: 'rowActive',
      }),
      ...mapGetters('MailboxStore', {
        rsMailbox: 'rs',
      }),
      ...mapGetters('MemberOrderStore', {
        rsMemberOrder: 'rsPending',
      }),
      ...mapGetters('StockiestOrderStore', {
        rsStockiestOrder: 'rsPending',
      }),
    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
      this.fetchSetting().then(result => {
        this.moveSetting(1);
      });
    },

    /************************
    <id="_methods">
    ************************/
    methods: {
      /************************
      <id="_mapActions">
      ************************/
      ...mapActions('SettingStore', {
        fetchSetting: 'fetchData',
        moveSetting: 'moveData',
      }),
    },

  }
</script>
