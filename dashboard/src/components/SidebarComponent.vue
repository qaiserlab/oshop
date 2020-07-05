<template>
  <div id="SidebarComponent" class="ui-sidebar">

    <transition :enter-active-class="isMobile?'animated slideInLeft':''"
    leave-active-class="animated slideOutLeft">
      <div v-if="display" class="sidebar">
        <slot name="menu"></slot>
      </div>
    </transition>

    <div class="header" :class="display?'push':''">
      <div class="container-fluid">
        <a v-if="isMobile" class="burger" :class="display?'push':''" href="javascript:" @click="toggle">
          <i class="fa fa-bars"></i>
        </a>

        <div class="pull-right">
          <slot name="header"></slot>
        </div>

      </div>
    </div>

    <div v-if="isMobile && display" @click="toggle" class="overlay"></div>

  </div>
</template>

<script>
  export default {

    /************************
    <id="_props">
    ************************/
    props: {

      icon: {
        type: String,
        default: '',
      },

      title: {
        type: String,
        default: 'Panel',
      },

    },

    /************************
    <id="_data">
    ************************/
    data() {
      return {
        display: false,
        isMobile: true,
      };
    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
      $(window).on('resize', () => {
        this.responsiveToggling();
      });

      this.responsiveToggling();
    },

    /************************
    <id="_destroyed">
    ************************/
    destroyed() {
      $(window).off('resize');
      $('body').css('margin-left', '0px');
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_responsiveToggling">
      ************************/
      responsiveToggling() {
        if ($(window).width() > 800) {
          this.display = true;
          this.isMobile = false;
          $('body').css('margin-left', '234px');
        }
        else {
          this.display = false;
          this.isMobile = true;
          $('body').css('margin-left', '0px');
        }
      },

      /************************
      <id="_toggle">
      ************************/
      toggle() {
        this.display = !this.display;
      },

    }

  }
</script>
