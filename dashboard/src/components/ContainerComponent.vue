<template>
  <div id="ContainerComponent" class="ui-container" :class="hidden_ + (fluid?'container-fluid':'container')">
    <slot></slot>
  </div>
</template>

<script>
  export default {

    /************************
    <id="_props">
    ************************/
    props: {

      fluid: {
        type: Boolean,
        default: false,
      },

      hidden: {
        type: String,
        default: '',
      },

    },

    /************************
    <id="_computed">
    ************************/
    computed: {

      /************************
      <id="_hidden_">
      ************************/
      hidden_() {
        if (!this.hidden) return '';

        let xHidden = this.hidden.split(' ');
        let hidden_ = '';

        xHidden.forEach(hidden => {
          hidden_ += 'hidden-' + hidden + ' ';
        });

        return hidden_;
      },

    },

  }
</script>
