<template>
  <div id="RowComponent" class="ui-row row" :class="hidden_ + (formGroup?'form-group':'')">
    <slot></slot>
  </div>
</template>

<script>
  export default {

    /************************
    <id="_props">
    ************************/
    props: {

      formGroup: {
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
