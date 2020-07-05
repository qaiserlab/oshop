<template>
  <main-layout>
    <ui-splash :display="splash">{{ splashMessage }}</ui-splash>

    <section class="content-header">
      <h1>
        Member Profile
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#/">
            <i class="fa fa-fw ti-home"></i>
          </a>
        </li>
        <li>
          <a href="javascript:">
            Member
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
                <label>Username</label>
                <div>{{ rowActive.memberId }}</div>
              </ui-col>

              <ui-col size="md-6" class="text-block">
                <label>Nama</label>
                <div>{{ rowActive.fullName }}</div>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-6" class="text-block">
                <label>Tanggal Lahir</label>
                <div>{{ rowActive.birthDate_ }}</div>
              </ui-col>

              <ui-col size="md-6" class="text-block">
                <label>Jenis Kelamin</label>
                <div>{{ rowActive.gender }}</div>
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

          <ui-panel title="Address" icon="edit">
            <ui-row form-group>
              <ui-col size="md-12" class="text-block">
                <label>Alamat</label>
                <div>{{ rowActive.address }}</div>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-6" class="text-block">
                <label>Provinsi</label>
                <div>{{ rowActive.province }}</div>
              </ui-col>

              <ui-col size="md-6" class="text-block">
                <label>Kota</label>
                <div>{{ rowActive.city }}</div>
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-6" class="text-block">
                <label>Kecamatan</label>
                <div>{{ rowActive.district }}</div>
              </ui-col>

              <ui-col size="md-6" class="text-block">
                <label>Kode Pos</label>
                <div>{{ rowActive.postalCode }}</div>
              </ui-col>
            </ui-row>
          </ui-panel>

        </ui-col>
        <ui-col size="md-3">

          <ui-panel title="Status" icon="edit">

            <ui-row v-if="rowActive.photo" form-group>
              <ui-col size="md-12">Photo</ui-col>
              <ui-col size="md-12">
                <img :src="rowActive.photo_">
              </ui-col>
            </ui-row>

            <ui-row form-group>
              <ui-col size="md-12">Aktifasi</ui-col>
              <ui-col size="md-12">
                <div class="label label-primary">
                  {{ rowActive.activation }}
                </div>
              </ui-col>
            </ui-row>

            <!-- <ui-row form-group>
              <ui-col size="md-12">Peringkat</ui-col>
              <ui-col size="md-12">
                <div class="label label-primary">
                  {{ rowActive.level.num }} - {{ rowActive.level.name }}
                </div>
              </ui-col>
            </ui-row> -->

            <ui-row form-group>
              <ui-col size="md-12">Registered On</ui-col>
              <ui-col size="md-12">
                <b>
                  {{ rowActive.registeredOn_ }}
                </b>
              </ui-col>
            </ui-row>

          </ui-panel>

        </ui-col>

      </ui-row>

    </section>

    <ui-buttonbar>
      <ui-button href="javascript:"
      @click="back"
      bs-type="danger"
      icon="arrow-left"></ui-button>
      <ui-button @click="changeState" :loading="loading"
      :icon="rowActive.activation == 'Active'?'close':'check'"></ui-button>
      <ui-button @click="loginDialog = true"
      bs-type="success"
      icon="sign-in"></ui-button>
    </ui-buttonbar>

    <ui-modal @close="loginDialog = false" :display="loginDialog" title="Login" icon="lock">
      <div slot="message">
        <ui-alert :data-source="result.data"
        :display="result.state == 'invalid'"
        @close="result.state = ''">
          {{ result.message }}
        </ui-alert>
        <p>Login dengan akun ini sebagai?</p>
      </div>
      <div slot="buttonbar">
        <ui-button @click="loginMember" :loading="memberLoading">Member</ui-button>
        <ui-button @click="loginStockiest" :loading="stockiestLoading">Stokist</ui-button>
        <ui-button @click="loginDialog = false" bs-type="danger">Batal</ui-button>
      </div>
    </ui-modal>

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
        memberLoading: false,
        stockiestLoading: false,
        splash: false,
        splashMessage: '',
        loginDialog: false,

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
        fetchData: 'fetchData',
      }),

      /************************
      <id="_back">
      ************************/
      back() {
        window.history.back();
      },

      /************************
      <id="_changeState">
      ************************/
      changeState() {
        this.loading = true;

        let data = this.rowActive;

        if (this.rowActive.activation == 'Active') {
          data.activation = 'Inactive';
          this.splashMessage = `${this.rowActive.fullName} telah di non aktifkan`;
        }
        else {
          data.activation = 'Active';
          this.splashMessage = `${this.rowActive.fullName} telah diaktifkan`;
        }

        this.updateData(data).then(result => {

          this.splash = true;

          setTimeout(() => {
            this.splash = false;
          }, 2000);

          this.loading = false;
          this.fetchData();
        });
      },

      /************************
      <id="_loginMember">
      ************************/
      loginMember() {
        let data = {
          type: 'member',
          mode: 'Member',
          email: this.rowActive.memberId,
          password: 'PASSWORD-BREAK-' + this.rowActive.password,
        };

        this.memberLoading = true;

        api.post('account/login', data).then(result => {
          this.memberLoading = false;
          this.result = result;

          if (result.state == 'success')
            window.open('https://cozmeed.id/member/profile');

        });
      },

      /************************
      <id="_loginStockiest">
      ************************/
      loginStockiest() {
        let data = {
          type: 'member',
          mode: 'Stokist',
          email: this.rowActive.memberId,
          password: 'PASSWORD-BREAK-' + this.rowActive.stockiestPassword,
        };

        this.stockiestLoading = true;

        api.post('account/login', data).then(result => {
          this.stockiestLoading = false;
          this.result = result;

          if (result.state == 'success')
            window.open('https://cozmeed.id/member/profile');
        });
      },

    },

  }
</script>
