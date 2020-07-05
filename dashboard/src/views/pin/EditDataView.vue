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
          Ubah Data
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
        <ui-col size="md-12">

          <ui-panel title="Editor" icon="edit">
            <ui-row form-group>
              <ui-col size="md-12">Serial Number</ui-col>
              <ui-col size="md-9">
                <ui-textbox v-model="form.serialNumber"></ui-textbox>
              </ui-col>
              <ui-col size="md-3">
                <ui-button @click="generateSN">Generate SN</ui-button>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-12">PIN</ui-col>
              <ui-col size="md-9">
                <ui-textbox v-model="form.pin"></ui-textbox>
              </ui-col>
              <ui-col size="md-3">
                <ui-button @click="generatePIN">Generate PIN</ui-button>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-12">
                <checkbox v-model="form.useSponsor">Use Sponsor</checkbox>
              </ui-col>
            </ui-row>

            <ui-row v-if="form.useSponsor" form-group>
              <ui-col size="md-12">Sponsor ID</ui-col>
              <ui-col size="md-9">
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
          serialNumber: '',
          pin: '',
          useSponsor: false,
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
    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
      this.moveData(this.$route.params.id);

      this.form.serialNumber = this.rowActive.serialNumber;
      this.form.pin = this.rowActive.pin;
      this.form.useSponsor = this.rowActive.useSponsor;
      this.form.sponsorId = this.rowActive.sponsor.memberId;
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_mapActions">
      ************************/
      ...mapActions('PinStore', {
        moveData: 'moveData',
        updateData: 'updateData',
      }),

      /************************
      <id="_saveData">
      ************************/
      saveData() {
        this.loading = true;

        this.updateData(this.form).then(result => {

          this.loading = false;
          this.result = result;

          this.splash = true;

          setTimeout(() => {
            this.splash = false;
          }, 2000);

        }).catch(result => {

          this.loading = false;
          this.result = result;

        });
      },

    },

  }
</script>
