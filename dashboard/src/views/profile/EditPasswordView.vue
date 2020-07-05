<template>
  <main-layout>
    <ui-splash :display="splash">{{ result.message }}</ui-splash>

    <section class="content-header">
      <h1>
        Profile
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li>
          <a href="#/profile">
            Profile
          </a>
        </li>
        <li class="active">
          Ubah Password
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
              <ui-col size="md-3">Password Lama</ui-col>
              <ui-col size="md-5">
                <ui-textbox v-model="form.oldPassword" type="password"></ui-textbox>
              </ui-col>
            </ui-row>
            <ui-row form-group>
              <ui-col size="md-3">Password Baru</ui-col>
              <ui-col size="md-5">
                <ui-textbox v-model="form.newPassword" type="password"></ui-textbox>
              </ui-col>
            </ui-row>
            <ui-row form-group>
              <ui-col size="md-3">Ulangi Password</ui-col>
              <ui-col size="md-5">
                <ui-textbox v-model="form.retypePassword" type="password"></ui-textbox>
              </ui-col>
            </ui-row>

          </ui-panel>

        </ui-col>

      </ui-row>
    </section>

    <ui-buttonbar>
      <ui-button href="#/profile"
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
          oldPassword: '',
          newPassword: '',
          retypePassword: '',
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
      ...mapGetters('AccountStore', {
        rowActive: 'myAccount',
      }),
    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
      let fullName = this.rowActive.fullName;
      let xFullName = fullName.split(' ');
      let firstName = xFullName[0];
      let lastName = xFullName[1]?xFullName[1]:'';

      this.form.firstName = firstName.trim();
      this.form.lastName = lastName.trim();
      this.form.email = this.rowActive.email;
      this.form.phoneNumber = this.rowActive.phoneNumber;
      this.form.photo = this.rowActive.photo;
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_mapActions">
      ************************/
      ...mapActions('AccountStore', {
        moveData: 'moveData',
        updateProfile: 'updateProfile',
      }),

      /************************
      <id="_saveData">
      ************************/
      saveData() {
        this.loading = true;

        api.put('account/update-user-password/' + localStorage.authKey, this.form).then(result => {
          if (result.state == 'success') {
            this.loading = false;
            this.result = result;

            this.splash = true;

            setTimeout(() => {
              this.splash = false;
              this.$router.push('/profile');
            }, 2000);
          }
          else {

            this.loading = false;
            this.result = result;
          }
        });

      },

    },

  }
</script>
