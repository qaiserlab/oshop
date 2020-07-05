<template>
  <main-layout>
    <ui-splash :display="splash">{{ result.message }}</ui-splash>

    <section class="content-header">
      <h1>
        Berita
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li>
          <a href="#/news/all-data">
            Berita
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
        <ui-col size="md-9">

          <ui-panel title="Editor" icon="edit">
            <ui-row form-group>
              <ui-col size="md-12">Judul</ui-col>
              <ui-col size="md-12">
                <ui-textbox v-model="form.title"></ui-textbox>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-12">
                <trumbowyg v-model="form.content"></trumbowyg>
              </ui-col>
            </ui-row>
          </ui-panel>

        </ui-col>
        <ui-col size="md-3">

          <ui-panel title="Settings" icon="edit">
            <ui-row form-group>
              <ui-col size="md-12">Publikasi</ui-col>
              <ui-col size="md-12">
                <ui-select v-model="form.publication" :data-source="rsPublication"></ui-select>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-12">Gambar</ui-col>
              <ui-col size="md-12">
                <ui-image v-model="form.featuredImage"></ui-image>
              </ui-col>
            </ui-row>
          </ui-panel>

        </ui-col>

      </ui-row>

    </section>

    <ui-buttonbar>
      <ui-button href="#/news/all-data"
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
          content: '',
          publication: '',
          featuredImage: '',
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
      ...mapGetters('NewsStore', {
        rowActive: 'rowActive',
      }),
    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
      this.moveData(this.$route.params.id);

      this.form.title = this.rowActive.title;
      this.form.content = this.rowActive.content;
      this.form.publication = this.rowActive.publication;
      this.form.featuredImage = this.rowActive.featuredImage;
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_mapActions">
      ************************/
      ...mapActions('NewsStore', {
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
