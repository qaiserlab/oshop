<template>
  <div id="MainLayout">

    <ui-sidebar>
      <div id="menu" slot="menu">

        <div class="nav_profile" v-if="myAccount.authKey">
          <div class="media profile-left">
            <a class="pull-left profile-thumb" href="#">
            <img :src="photo" alt=""></a>
            <div class="content-profile">
              <h4 class="media-heading">{{ myAccount.fullName }}</h4>
              <ul class="icon-list">
                <li>
                  <a href="#/profile">
                    <i class="fa fa-fw ti-user"></i>
                  </a>
                </li>
                <li>
                  <a href="#/bank/all-data">
                    <i class="fa fa-fw ti-money"></i>
                  </a>
                </li>

                <!-- <li>
                  <a href="lockscreen.html">
                    <i class="fa fa-fw ti-lock"></i>
                  </a>
                </li>
                <li>
                  <a href="edit_user.html">
                    <i class="fa fa-fw ti-settings"></i>
                  </a>
                </li> -->
                <li>
                  <a @click="logoutDialog = true" href="javascript:">
                    <i class="fa fa-fw ti-shift-right"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <ui-navbar :data-source="menu"></ui-navbar>
      </div>

      <div slot="header">
        <header-layout @logout="logoutDialog = true"></header-layout>
      </div>
    </ui-sidebar>

    <ui-container class="right-side" fluid>
      <slot></slot>
    </ui-container>

    <ui-modal @close="logoutDialog = false" :display="logoutDialog" title="Confirm" icon="question">
      <div slot="message">Logout from Application?</div>
      <div slot="buttonbar">
        <ui-button @click="logout" :loading="logoutLoading">OK</ui-button>
        <ui-button @click="logoutDialog = false" bs-type="danger">Cancel</ui-button>
      </div>
    </ui-modal>

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
        logoutLoading: false,
        logoutDialog: false,
      }
    },

    /************************
    <id="_computed">
    ************************/
    computed: {
      ...mapGetters('AccountStore', {
        accountIsAuthen: 'isAuthen',
        myAccount: 'myAccount',
      }),
      ...mapGetters('MenuStore', {
        menu: 'data',
      }),

      /************************
      <id="_photo">
      ************************/
      photo() {
        if (this.myAccount.photo == 'undefined')
          return '/assets/images/guest-icon-2.png';
        else
          return '/writable/archives/' + this.myAccount.photo;
      },
    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
      this.accountReload();

      if (!this.accountIsAuthen)
        this.$router.push('/login');
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_mapActions">
      ************************/
      ...mapActions('AccountStore', {
        accountReload: 'reload',
        accountLogout: 'logout',
      }),

      /************************
      <id="_logout">
      ************************/
      logout() {
        this.logoutLoading = true;

        this.accountLogout().then(result => {

          this.logoutLoading = false;
          this.logoutDialog = false;

          this.$router.push({ path: '/login' });

        }).catch(result => {

          this.logoutLoading = false;
          this.logoutDialog = false;

          console.log('Logout failed');
        });
      },
    },

  }
</script>
