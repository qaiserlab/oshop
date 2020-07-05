<template>
  <main-layout>
    <ui-splash :display="splash">{{ result.message }}</ui-splash>

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
        <li>
          <a href="#/pin/all-data">
            Isi Ulang PIN
          </a>
        </li>
        <li class="active">
          Buat Data Baru
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
        <ui-col size="md-8">

          <ui-panel title="Editor" icon="edit">
            <ui-row form-group>
              <ui-col size="md-12">Qty</ui-col>
              <ui-col size="md-12">
                <ui-textbox v-model="form.quantity"></ui-textbox>
              </ui-col>
            </ui-row>

            <ui-table :data-source="rsPin" v-if="rsPin.length > 0">
              <tr>
                <th>SN</th>
                <th>PIN</th>
              </tr>
            </ui-table>
          </ui-panel>

        </ui-col>

        <ui-col size="md-4">

          <ui-panel title="Settings" icon="edit">
            <!-- <ui-row form-group>
              <ui-col size="md-12">
                <checkbox v-model="form.useSponsor">Sponsor</checkbox>
              </ui-col>
            </ui-row> -->

            <ui-row v-if="form.useSponsor" form-group>
              <ui-col size="md-12">ID Sponsor</ui-col>
              <ui-col size="md-12">
                <ui-textbox v-model="form.sponsorId"></ui-textbox>
              </ui-col>
            </ui-row>
          </ui-panel>

        </ui-col>

      </ui-row>
    </section>

    <ui-buttonbar>
      <ui-button href="#/pin/all-data"
      bs-type="danger"
      icon="arrow-left"></ui-button>
      <ui-button @click="saveData" :loading="loading" icon="floppy-o"></ui-button>
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
          quantity: '',
          useSponsor: true,
          sponsorId: '',
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
      ...mapGetters('PinStore', {
        rowActive: 'rowActive',
      }),

      /************************
      <id="_rsPin">
      ************************/
      rsPin() {
        let rsPin = [];

        for (let i = 1; i <= this.form.quantity; i++) {
          rsPin.push({
            sn: this.generateSn(),
            pin: this.generatePin(),
          });
        }

        return rsPin;
      },
    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_mapActions">
      ************************/
      ...mapActions('PinStore', {
        createData: 'createData',
        moveLastData: 'moveLastData',
      }),

      /************************
      <id="_saveData">
      ************************/
      saveData() {
        this.loading = true;

        var data = this.form;
        data.rsPin = this.rsPin;

        this.createData(data).then(result => {

          this.moveLastData();

          this.loading = false;
          this.result = result;

          this.splash = true;

          this.form.quantity = '';
          this.form.useSponsor = false;
          this.form.sponsor = '';

          setTimeout(() => {
            this.splash = false;

            // setTimeout(() => {
            //   this.$router.push('/pin/edit-data/' + this.rowActive._id);
            // }, 500);
          }, 1500);

        }).catch(result => {

          this.loading = false;
          this.result = result;

        });
      },

      /************************
      <id="_addZero">
      ************************/
      addZero(i) {
        if (i < 10)
          i = "0" + i;
        return i;
      },

      /************************
      <id="_generateSn">
      ************************/
      generateSn() {
        let now = new Date();
        var random5number = Math.floor(Math.random()*90000) + 10000;
        let sn = random5number + '0' + this.addZero(now.getHours()) +
        this.addZero(now.getMinutes()) +
        this.addZero(now.getSeconds());
        return sn;
      },

      /************************
      <id="_generatePin">
      ************************/
      generatePin() {
        var random5number = Math.floor(Math.random()*90000) + 10000;
        return random5number;
      },

    },

  }
</script>
