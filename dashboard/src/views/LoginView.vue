<template>
  <div id="LoginView">

    <ui-container fluid>

      <ui-alert :data-source="result.data"
      :display="result.state == 'invalid'"
      @close="result.state = ''">
        {{ result.message }}
      </ui-alert>

      <ui-panel title="Login">
        <ui-row form-group>
          <ui-col size="xs-3">Username</ui-col>
          <ui-col size="xs-9">
            <ui-textbox v-model="form.email"></ui-textbox>
          </ui-col>
        </ui-row>

        <ui-row form-group>
          <ui-col size="xs-3">Password</ui-col>
          <ui-col size="xs-9">
            <ui-textbox v-model="form.password" type="password"></ui-textbox>
          </ui-col>
        </ui-row>

        <ui-row form-group>
          <ui-col size="md-12">
            <ui-button @click="login" :loading="loading" icon="lock">Login</ui-button>
          </ui-col>
        </ui-row>
      </ui-panel>

    </ui-container>

  </div>

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
        result: {
          state: '',
          message: '',
          data: {},
        },

        form: {
          email: '',
          password: '',
          type: 'user',
        },
      };
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_mapActions">
      ************************/
      ...mapActions('AccountStore', {
        'accountLogin': 'login',
      }),

      /************************
      <id="_login">
      ************************/
      login() {
        this.loading = true;

        this.accountLogin(this.form).then(result => {

          this.loading = false;
          this.$router.push('/');

        }).catch(result => {
          this.loading = false;
          this.result = result;

        });
      },
    },

  }
</script>
