<template>
  <main-layout>
    <ui-splash :display="splash">{{ result.message }}</ui-splash>

    <section class="content-header">
      <h1>
        Buat Stokist Baru
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li class="active">
          Buat Stokist Baru
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

          <ui-panel title="Editor" icon="edit">
            <ui-row form-group>
              <ui-col size="md-12">Username</ui-col>
              <ui-col size="md-12">
                <ui-textbox v-model="form.memberId"></ui-textbox>
              </ui-col>
            </ui-row>
          </ui-panel>

        </ui-col>
        <ui-col size="md-3">

          <ui-panel title="Settings" icon="edit">

            <ui-row form-group>
              <ui-col size="md-12">Tipe</ui-col>
              <ui-col size="md-12">
                <ui-select v-model="form.type" :data-source="rsStockiestType"></ui-select>
              </ui-col>
            </ui-row>

          </ui-panel>

        </ui-col>

      </ui-row>
    </section>

    <ui-buttonbar>
      <!-- <ui-button href="#/news/all-data"
      bs-type="danger"
      icon="arrow-left"></ui-button> -->
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
          memberId: '',
          type: '',
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
      ...mapGetters('StockiestTypeStore', {
        rsStockiestType: 'rs',
      }),
      ...mapGetters('StockiestStore', {
        rowActive: 'rowActive',
      }),
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
      ...mapActions('StockiestStore', {
        createData: 'createData',
        moveLastData: 'moveLastData',
      }),

      /************************
      <id="_saveData">
      ************************/
      saveData() {
        this.loading = true;

        this.createData(this.form).then(result => {

          // this.moveLastData();

          this.loading = false;
          this.result = result;

          this.form.memberId = '';
          this.form.type = '';

          this.splash = true;

          setTimeout(() => {
            this.splash = false;

            // setTimeout(() => {
            //   this.$router.push('/news/edit-data/' + this.rowActive._id);
            // }, 500);
          }, 1500);

        }).catch(result => {

          this.loading = false;
          this.result = result;

        });
      },

    },

  }
</script>
