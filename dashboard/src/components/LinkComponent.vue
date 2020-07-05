<template>
  <a id="LinkComponent" class="ui-link" :href="href" @click="handleClick">
    <i v-if="loading" class="fa fa-spin fa-refresh"></i>
    <i v-if="!loading && icon" :class="'fa fa-' + icon"></i>
    <slot></slot>
  </a>
</template>

<script>
  export default {

    /************************
    <id="_props">
    ************************/
    props: {

      href: {
        type: String,
        default: 'javascript:',
      },

      icon: {
        type: String,
        default: '',
      },

      loading: {
        type: Boolean,
        default: false,
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
      },

    },

  }
</script>
