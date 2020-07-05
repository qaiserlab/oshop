<template>
  <div id="HeaderLayout" class="header hidden-xs">
    <a href="#/" class="logo">
      <img src="../assets/images/logo.png" alt="Oshop">
    </a>

    <div class="navbar-right">
      <ul class="nav navbar-nav">
        <li class="dropdown messages-menu">
          <a href="#/mailbox/all-data" class="dropdown-toggle" data-toggle="dropdown">
            <i class="fa fa-fw ti-email black"></i>
            <span class="label"
            :class="rsMailbox.length > 0?'label-success':'label-danger'">
              {{ rsMailbox.length }}
            </span>
          </a>
          <!-- <ul class="dropdown-menu dropdown-messages table-striped">
            <li class="dropdown-title">New Messages</li>
            <li>
              <a href="" class="message striped-col">
                <img class="message-image img-circle" src="img/authors/avatar7.jpg" alt="avatar-image">

                <div class="message-body"><strong>Ernest Kerry</strong>
                  <br>
                  Can we Meet?
                  <br>
                  <small>Just Now</small>
                  <span class="label label-success label-mini msg-lable">New</span>
                </div>
              </a>
            </li>
            <li>
              <a href="" class="message">
                <img class="message-image img-circle" src="img/authors/avatar6.jpg" alt="avatar-image">

                <div class="message-body"><strong>John</strong>
                  <br>
                  Dont forgot to call...
                  <br>
                  <small>5 minutes ago</small>
                  <span class="label label-success label-mini msg-lable">New</span>
                </div>
              </a>
            </li>
            <li>
              <a href="" class="message striped-col">
                <img class="message-image img-circle" src="img/authors/avatar5.jpg" alt="avatar-image">

                <div class="message-body">
                  <strong>Wilton Zeph</strong>
                  <br>
                  If there is anything else …
                  <br>
                  <small>14/10/2014 1:31 pm</small>
                </div>

              </a>
            </li>
            <li>
              <a href="" class="message">
                <img class="message-image img-circle" src="img/authors/avatar1.jpg" alt="avatar-image">
                <div class="message-body">
                  <strong>Jenny Kerry</strong>
                  <br>
                  Let me know when you free
                  <br>
                  <small>5 days ago</small>
                </div>
              </a>
            </li>
            <li>
              <a href="" class="message striped-col">
                <img class="message-image img-circle" src="img/authors/avatar.jpg" alt="avatar-image">
                <div class="message-body">
                  <strong>Tony</strong>
                  <br>
                  Let me know when you free
                  <br>
                  <small>5 days ago</small>
                </div>
              </a>
            </li>
            <li class="dropdown-footer"><a href="#"> View All messages</a></li>
          </ul> -->

        </li>
        <!--rightside toggle-->
        <li>
          <a href="#/member-new-order/all-data" class="dropdown-toggle toggle-right" data-toggle="dropdown">
            <i class="fa fa-fw ti-shopping-cart-full black"></i>
            <span class="label"
            :class="rsMemberOrder.length > 0?'label-success':'label-danger'">
              {{ rsMemberOrder.length }}
            </span>
          </a>
        </li>
        <li>
          <a href="#/new-order/all-data" class="dropdown-toggle toggle-right" data-toggle="dropdown">
            <i class="fa fa-fw ti-shopping-cart-full black"></i>
            <span class="label"
            :class="rsStockiestOrder.length > 0?'label-success':'label-danger'">
              {{ rsStockiestOrder.length }}
            </span>
          </a>
        </li>

        <!-- User Account: style can be found in dropdown-->
        <li class="dropdown user user-menu open">
          <a @click="expanded = !expanded" href="javascript:" class="dropdown-toggle padding-user" data-toggle="dropdown" aria-expanded="true">
            <!-- <img :src="photo" class="img-responsive pull-left" alt="" height="35"> -->
            <div class="riot">
              <div>
                {{ myAccount.fullName }}
                <span>
                  <i class="caret"></i>
                </span>
              </div>
            </div>
          </a>
          <ul v-if="expanded" class="dropdown-menu">
            <!-- User image -->
            <li class="user-header">
              <img :src="photo" class="" alt="">
              <p>{{ myAccount.fullName }}</p>
            </li>
            <!-- Menu Body -->
            <li class="p-t-3">
              <a href="#/profile">
                <i class="fa fa-fw ti-user"></i> Profile
              </a>
            </li>
            <li role="presentation"></li>

            <li>
              <a href="#/bank/all-data">
                <i class="fa fa-fw ti-money"></i> Bank
              </a>
            </li>
            <li role="presentation" class="divider"></li>

            <!-- Menu Footer-->
            <li class="user-footer">
              <div class="pull-left">
                <a href="javascript:" @click="expanded = false" style="font-size: 11px">
                  <i class="fa fa-fw ti-close"></i>
                  Close
                </a>
              </div>
              <div class="pull-right">
                <a href="javascript:" @click="handleLogout" style="font-size: 11px">
                  <i class="fa fa-fw ti-shift-right"></i>
                  Logout
                </a>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>

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
        expanded: false,
      }
    },

    /************************
    <id="_computed">
    ************************/
    computed: {

      /************************
      <id="_mapGetters">
      ************************/
      ...mapGetters('AccountStore', {
        myAccount: 'myAccount',
      }),
      ...mapGetters('MailboxStore', {
        rsMailbox: 'rs',
      }),
      ...mapGetters('MemberOrderStore', {
        rsMemberOrder: 'rsPending',
      }),
      ...mapGetters('StockiestOrderStore', {
        rsStockiestOrder: 'rsPending',
      }),

      /************************
      <id="_photo">
      ************************/
      photo() {
        if (this.myAccount.photo == 'undefined')
          return '/assets/images/guest-icon-1.png';
        else
          return '/writable/archives/' + this.myAccount.photo;
      },
    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
      this.fetchMailbox();
      this.fetchMemberOrder();
      this.fetchStockiestOrder();
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_mapActions">
      ************************/
      ...mapActions('MailboxStore', {
        fetchMailbox: 'fetchData',
      }),
      ...mapActions('MemberOrderStore', {
        fetchMemberOrder: 'fetchData',
      }),
      ...mapActions('StockiestOrderStore', {
        fetchStockiestOrder: 'fetchData',
      }),

      /************************
      <id="_handleLogout">
      ************************/
      handleLogout(event) {
        this.$emit('logout');
      },

    },

  }

</script>
