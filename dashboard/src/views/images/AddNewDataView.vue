<template>
  <main-layout>
    <ui-splash :display="splash">{{ result.message }}</ui-splash>

    <section class="content-header">
      <h1>
        Image
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li>
          <a href="#/images/all-data">
            Image
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
              <ui-col size="md-1">Judul</ui-col>
              <ui-col size="md-11">
                <ui-textbox v-model="form.title"></ui-textbox>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-1">Gambar</ui-col>
              <ui-col size="md-11">
                <ui-image v-model="form.image"></ui-image>
              </ui-col>
            </ui-row>

            <ui-row style="display: none" form-group>
              <ui-col size="md-1">Content</ui-col>
              <ui-col size="md-11">
                <ui-textarea v-model="form.content"></ui-textarea>
              </ui-col>
            </ui-row>
          </ui-panel>

        </ui-col>
        <ui-col size="md-4">

          <ui-panel title="Settings" icon="edit">
            <ui-row form-group>
              <ui-col size="md-3">Publikasi</ui-col>
              <ui-col size="md-9">
                <ui-select v-model="form.publication" :data-source="rsPublication"></ui-select>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-3">URL</ui-col>
              <ui-col size="md-9">
                <ui-textbox v-model="form.url"></ui-textbox>
              </ui-col>
            </ui-row>
          </ui-panel>

        </ui-col>

      </ui-row>
    </section>

    <ui-buttonbar>
      <ui-button href="#/images/all-data"
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
          title: '',
          image: '',
          content: '',
          url: '',
          publication: '',
        },

        rsPublication: [
          { id: 'Draft' },
          { id: 'Publish' },
        ],

      };
    },

    /************************
    <id="_computed">
    ************************/
    computed: {
      /************************
      <id="_mapGetters">
      ************************/
      ...mapGetters('ImageStore', {
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
      ...mapActions('ImageStore', {
        createData: 'createData',
        moveLastData: 'moveLastData',
      }),

      /************************
      <id="_saveData">
      ************************/
      saveData() {
        this.loading = true;

        this.createData(this.form).then(result => {

          this.moveLastData();

          this.loading = false;
          this.result = result;

          this.splash = true;

          setTimeout(() => {
            this.splash = false;

            setTimeout(() => {
              this.$router.push('/images/edit-data/' + this.rowActive._id);
            }, 500);
          }, 1500);

        }).catch(result => {

          this.loading = false;
          this.result = result;

        });
      },

    },

  }
</script>
