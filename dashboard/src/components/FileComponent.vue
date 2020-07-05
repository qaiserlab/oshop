<template>
  <div id="ImageComponent" class="ui-image">
    <label v-if="this.$slots.default">
      <slot></slot>
    </label>

    <!-- <img v-if="url" :src="url"> -->

    <div v-if="url">
      {{ url }}
    </div>
    <input type="file"
    @change="handleInput"
    class="form-control"
    :disabled="disabled || loading">
    <small class="pull-right" style="color: darkblue">{{ placeholder }}</small>

    <span class="icon">
      <i v-if="!loading" class="fa" :class="icon_"></i>
      <i v-if="loading" class="fa fa-spin fa-refresh"></i>
    </span>
  </div>
</template>

<script>
  export default {

    /************************
    <id="_props">
    ************************/
    props: {

      value: {
        type: String,
        default: '',
      },

      icon: {
        type: String,
        default: 'file-excel-o',
      },

      placeholder: {
        type: String,
        default: '',
      },

      disabled: {
        type: Boolean,
        default: false,
      },

    },

    /************************
    <id="_data">
    ************************/
    data() {
      return {
        loading: false,
        url: '',
      };
    },

    /************************
    <id="_computed">
    ************************/
    computed: {

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
      if (this.value)
        this.url = localStorage.archivesUrl + '/' + this.value;
    },

    /************************
    <id="_watch">
    ************************/
    watch: {
      value() {
        if (!this.url)
          this.url = localStorage.archivesUrl + '/' + this.value;
      },
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_handleInput">
      ************************/
      handleInput(event) {
        this.loading = true;

        let url = 'system/upload?extension=xls';

        let file = event.target.files[0];
        let formData = new FormData();

        formData.append('apiKey', localStorage.apiKey);
        formData.append('fileActive', file);

        $.ajax({
          method: 'POST',
          cache: false,
          contentType: false,
          processData: false,

          url: localStorage.apiUrl + '/system/upload?extension=xls',
          data: formData,

          success: result => {
            this.url = result.data.url;
            this.loading = false;

            this.$emit('input', result.data.file);

          },
        });

      },

    },
  }
</script>
