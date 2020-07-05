<template>
  <div id="ButtonbarComponent" class="ui-buttonbar">
    <slot></slot>
  </div>
</template>

<script>
  export default {

    /************************
    <id="_props">
    ************************/
    props: {
      type: {
        type: String,
        default: 'button',
      },

      bsType: {
        type: String,
        default: 'primary',
      },

      icon: {
        type: String,
        default: '',
      },

      disabled: {
        type: Boolean,
        default: false,
      },

      loading: {
        type: Boolean,
        default: false,
      },

      href: {
        type: String,
        default: '',
      },

    },

    /************************
    <id="_computed">
    ************************/
    computed: {

      /************************
      <id="_bsType_">
      ************************/
      bsType_() {
        if (this.bsType)
          return 'btn-' + this.bsType;
        else
          return '';
      },

      /************************
      <id="_icon_">
      ************************/
      icon_() {
        if (this.icon)
          return 'fa-' + this.icon;
        else
          return '';
      },

    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {
      $('body').css('margin-bottom', '80px');
    },

    /************************
    <id="_destroyed">
    ************************/
    destroyed() {
      $('body').css('margin-bottom', '0');
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_handleClick">
      ************************/
      handleClick(event) {
        this.$emit('click');

        if (this.href)
          window.location = this.href;
      },

    },
  }
</script>
