<template>
  <main-layout>
    <ui-splash :display="splash">{{ result.message }}</ui-splash>

    <section class="content-header">
      <h1>
        Member Tidak Aktif
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li>
          <a href="#/free-member/inactive-member/all-data">
            Member Tidak Aktif
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
              <ui-col size="md-2">First Name</ui-col>
              <ui-col size="md-4">
                <ui-textbox v-model="form.firstName"></ui-textbox>
              </ui-col>

              <ui-col size="md-2">Last Name</ui-col>
              <ui-col size="md-4">
                <ui-textbox v-model="form.lastName"></ui-textbox>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-2">Birth Date</ui-col>
              <ui-col size="md-4">
                <ui-datepicker v-model="form.birthDate"></ui-datepicker>
              </ui-col>

              <ui-col size="md-2">Gender</ui-col>
              <ui-col size="md-4">
                <ui-select v-model="form.gender" :data-source="rsGender"></ui-select>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-2">Email</ui-col>
              <ui-col size="md-4">
                <ui-textbox v-model="form.email"></ui-textbox>
              </ui-col>

              <ui-col size="md-2">Phone Number</ui-col>
              <ui-col size="md-4">
                <ui-textbox v-model="form.phoneNumber"></ui-textbox>
              </ui-col>
            </ui-row>
          </ui-panel>

          <ui-panel title="Address" icon="edit">
            <ui-row form-group>
              <ui-col size="md-12">
                <ui-textarea v-model="form.address"></ui-textarea>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-2">Province</ui-col>
              <ui-col size="md-4">
                <ui-select v-model="form.province"></ui-select>
              </ui-col>

              <ui-col size="md-2">City</ui-col>
              <ui-col size="md-4">
                <ui-select v-model="form.city"></ui-select>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-2">District</ui-col>
              <ui-col size="md-4">
                <ui-select v-model="form.district"></ui-select>
              </ui-col>

              <ui-col size="md-2">Postal Code</ui-col>
              <ui-col size="md-4">
                <ui-textbox v-model="form.postalCode"></ui-textbox>
              </ui-col>
            </ui-row>
          </ui-panel>

        </ui-col>
        <ui-col size="md-3">

          <ui-panel title="Settings" icon="edit">
            <!-- <ui-row form-group>
              <ui-col size="md-12">Publikasi</ui-col>
              <ui-col size="md-12">
                <ui-select v-model="form.publication" :data-source="rsPublication"></ui-select>
              </ui-col>
            </ui-row> -->

            <ui-row form-group>
              <ui-col size="md-12">Photo</ui-col>
              <ui-col size="md-12">
                <ui-image v-model="form.photo"></ui-image>
              </ui-col>
            </ui-row>
          </ui-panel>

        </ui-col>

      </ui-row>

    </section>

    <ui-buttonbar>
      <ui-button href="#/free-member/inactive-member/all-data"
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
          firstName: '',
          lastName: '',
          birthDate: '',
          gender: '',
          email: '',
          phoneNumber: '',
          address: '',
          province: '',
          city: '',
          district: '',
          postalCode: '',
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
      ...mapGetters('GenderStore', {
        rsGender: 'rs',
      }),
      ...mapGetters('MemberStore', {
        rowActive: 'rowActive',
      }),
    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
      this.moveData(this.$route.params.id);

      this.form.firstName = this.rowActive.firstName;
      this.form.lastName = this.rowActive.lastName;
      this.form.birthDate = this.rowActive.birthDate;
      this.form.gender = this.rowActive.gender;
      this.form.email = this.rowActive.email;
      this.form.phoneNumber = this.rowActive.phoneNumber;
      this.form.address = this.rowActive.address;
      this.form.province = this.rowActive.province;
      this.form.city = this.rowActive.city;
      this.form.district = this.rowActive.district;
      this.form.postalCode = this.rowActive.postalCode;
      this.form.photo = this.rowActive.photo;
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
