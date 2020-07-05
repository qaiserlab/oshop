<template>
  <main-layout>
    <ui-splash :display="splash">{{ result.message }}</ui-splash>

    <section class="content-header">
      <h1>
        Menu
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li>
          <a href="#/menus/all-data">
            Menu
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
              <ui-col size="md-1">Judul</ui-col>
              <ui-col size="md-11">
                <ui-textbox v-model="form.title"></ui-textbox>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-12">
                <ui-menu v-model="form.menu"></ui-menu>
              </ui-col>
            </ui-row>
          </ui-panel>

        </ui-col>
        <!-- <ui-col size="md-4">

          <ui-panel title="Settings" icon="edit">
            <ui-row form-group>
              <ui-col size="md-3">Publikasi</ui-col>
              <ui-col size="md-9">
                <ui-select v-model="form.publication" :data-source="rsPublication"></ui-select>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-3">Gambar</ui-col>
              <ui-col size="md-9">
                <ui-image v-model="form.image"></ui-image>
              </ui-col>
            </ui-row>
          </ui-panel>

        </ui-col> -->

      </ui-row>
    </section>

    <ui-buttonbar>
      <ui-button href="#/menus/all-data"
      bs-type="danger"
      icon="arrow-left"></ui-button>
      <ui-button @click="saveData" :loading="loading" icon="floppy-o"></ui-button>
      <!-- <ui-button href="#/menus/add-new-data" icon="plus"></ui-button> -->
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
          menu: {},
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
      // ...mapGetters('PublicationStore', {
      //   rsPublication: 'rs',
      // }),
      ...mapGetters('WebsiteMenuStore', {
        rsParent: 'rsParent',
        rowActive: 'rowActive',
      }),
    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
      this.moveData(this.$route.params.id);

      this.form.title = this.rowActive.title;
      this.form.menu = this.rowActive.menu;
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_mapActions">
      ************************/
      ...mapActions('WebsiteMenuStore', {
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
