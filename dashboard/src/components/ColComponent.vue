<template>
  <div id="ColComponent" class="ui-col" :class="size_ + hidden_">
    <slot></slot>
  </div>
</template>

<script>
  export default {

    /************************
    <id="_props">
    ************************/
    props: {

      size: {
        type: String,
        default: '',
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
      <id="_size_">
      ************************/
      size_() {
        if (!this.size) return '';

        let xSize = this.size.split(' ');
        let size_ = '';

        xSize.forEach(size => {
          size_ += 'col-' + size + ' ';
        });

        return size_;
      },

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
