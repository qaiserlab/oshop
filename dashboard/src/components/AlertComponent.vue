<template>
  <div id="AlertComponent" class="ui-alert">
    <transition enter-active-class="animated shake"
    leave-active-class="animated fadeOut">
      <div v-if="display" class="ui-alert alert" :class="'alert-' + type">
        <button type="button" @click="handleClose" class="close">
          <i class="fa fa-close"></i>
        </button>
        <h4>
          <i v-if="icon" :class="'fa fa-' + icon"></i>
          <slot></slot>
        </h4>
        <p v-if="errors">
          <ul>
            <li v-for="row in errors">{{ row }}</li>
          </ul>
        </p>
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

      type: {
        type: String,
        default: 'danger',
      },

      display: {
        type: Boolean,
        default: false,
      },

      icon: {
        type: String,
        default: '',
      },

      dataSource: {
        type: Object,
        default: () => {},
      },

      dataField: {
        type: String,
        default: 'id',
      },

    },

    /************************
    <id="_computed">
    ************************/
    computed: {

      /************************
      <id="_errors">
      ************************/
      errors() {
        let errors = [];

        $.each(this.dataSource.errors, (i, row) => {
          errors.push(row.message);
        });

        return errors;
      },

    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_handleClose">
      ************************/
      handleClose(event) {
        this.$emit('close');
      },

    },
  }
</script>
