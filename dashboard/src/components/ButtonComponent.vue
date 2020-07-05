<template>
  <span id="ButtonComponent" class="ui-button">
    <button class="btn"
    @click="handleClick"
    :type="type"
    :class="bsType_"
    :disabled="disabled || loading">

      <i v-if="icon && !loading" class="fa" :class="icon_"></i>
      <i v-if="loading" class="fa fa-spin fa-refresh"></i>

      <slot></slot>
    </button>
  </span>
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
