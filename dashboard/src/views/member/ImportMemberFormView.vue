<template>
  <main-layout>
    <ui-splash :display="splash">{{ result.message }}</ui-splash>

    <section class="content-header">
      <h1>
        Import Member
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li class="active">
          Import Member
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

          <ui-panel title="Import" icon="edit">

            <ui-row form-group>
              <ui-col size="md-12">File (Excel)</ui-col>
              <ui-col size="md-12">
                <ui-file v-model="form.file"></ui-file>
              </ui-col>
            </ui-row>

          </ui-panel>

        </ui-col>

      </ui-row>
    </section>

    <ui-buttonbar>
      <ui-button @click="processData" :loading="loading" icon="floppy-o"></ui-button>
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
          file: '',
        },

      };
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
      <id="_processData">
      ************************/
      processData() {
        this.loading = true;
        let data = this.form;

        api.post('import-member', data).then(result => {
          if (result.state == 'success') {
            this.loading = false;
            this.result = result;

            this.form.file = '';
            this.splash = true;

            setTimeout(() => {
              this.splash = false;
            }, 1500);
          }
          else {
            this.loading = false;
            this.result = result;
          }
        });

        // this.createData(this.form).then(result => {
        //
        //   this.moveLastData();
        //
        //   this.loading = false;
        //   this.result = result;
        //
        //   this.splash = true;
        //
        //   setTimeout(() => {
        //     this.splash = false;
        //
        //     setTimeout(() => {
        //       this.$router.push('/pages/edit-data/' + this.rowActive._id);
        //     }, 500);
        //   }, 1500);
        //
        // }).catch(result => {
        //
        //   this.loading = false;
        //   this.result = result;
        //
        // });
      },

    },

  }
</script>
