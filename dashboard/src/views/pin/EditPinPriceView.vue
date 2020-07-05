<template>
  <main-layout>
    <ui-splash :display="splash">{{ result.message }}</ui-splash>

    <section class="content-header">
      <h1>
        Harga PIN
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li class="active">
          Harga PIN
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
              <ui-col size="md-12">Harga PIN</ui-col>
              <ui-col size="md-12">
                <ui-textbox v-model="form.pinPrice"></ui-textbox>
              </ui-col>
            </ui-row>
          </ui-panel>

        </ui-col>


      </ui-row>
    </section>

    <ui-buttonbar>
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
          pinPrice: '',
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
      ...mapGetters('SettingStore', {
        rowActive: 'rowActive',
      }),
    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
      this.fetchData().then(result => {
        this.moveData(1);
        if (this.rowActive) {
          this.form.pinPrice = this.rowActive.pinPrice;
        }
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
        fetchData: 'fetchData',
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
