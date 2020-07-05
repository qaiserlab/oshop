<template>
  <main-layout>

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
        <li class="active">
          Profile
        </li>
      </ol>
    </section>

    <section class="content">

      <ui-row>
        <ui-col size="md-9">

          <ui-panel title="Profile" icon="edit">
            <ui-row form-group>
              <ui-col size="md-6" class="text-block">
                <label>Nama</label>
                <div>{{ rowActive.fullName }}</div>
              </ui-col>

              <ui-col size="md-6" class="text-block">
                <label>Username</label>
                <div>{{ rowActive.memberId }}</div>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-6" class="text-block">
                <label>Email</label>
                <div>{{ rowActive.email }}</div>
              </ui-col>

              <ui-col size="md-6" class="text-block">
                <label>No. Telp</label>
                <div>{{ rowActive.phoneNumber }}</div>
              </ui-col>
            </ui-row>
          </ui-panel>

        </ui-col>
        <ui-col size="md-3">

          <ui-panel title="Foto" icon="edit">

            <ui-row v-if="rowActive.photo" form-group>
              <ui-col size="md-12">
                <img :src="photo" style="width: 100%">
              </ui-col>
            </ui-row>

            <!-- <ui-row form-group>
              <ui-col size="md-12">Registered On</ui-col>
              <ui-col size="md-12">
                <b>
                  {{ rowActive.registeredOn_ }}
                </b>
              </ui-col>
            </ui-row> -->

          </ui-panel>

        </ui-col>

      </ui-row>

    </section>

    <ui-buttonbar>
      <ui-button icon="edit"
      @click="editProfile"
      :loading="loading"></ui-button>
      <ui-button bs-type="danger"
      href="javascript:"
      @click="editPassword"
      icon="edit"></ui-button>
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

      /************************
      <id="_photo">
      ************************/
      photo() {
        if (this.rowActive.photo == 'undefined')
          return '/assets/images/guest-icon-1.png';
        else
          return '/writable/archives/' + this.rowActive.photo;
      },
    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
      this.moveData(this.$route.params.id);
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_mapActions">
      ************************/
      ...mapActions('MemberStore', {
        moveData: 'moveData',
      }),

      /************************
      <id="_editProfile">
      ************************/
      editProfile() {
        this.$router.push('/profile/edit-profile');
      },

      /************************
      <id="_editPassword">
      ************************/
      editPassword() {
        this.$router.push('/profile/edit-password');
      },

    },

  }
</script>
