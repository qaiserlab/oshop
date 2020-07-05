<template>
  <div id="SplashComponent" class="ui-splash">

    <transition enter-active-class="animated bounceInDown" leave-active-class="animated fadeOut">
      <div v-if="display">
        <i class="fa" :class="'fa-' + icon"></i>
        <slot></slot>
      </div>
    </transition>

  </div>
</template>

<script>
  export default {

    /************************
    <id="_props">
    ************************/
    props: {

      display: {
        type: Boolean,
        default: false,
      },

      icon: {
        type: String,
        default: 'info-circle',
      },

    },

  }
</script>
