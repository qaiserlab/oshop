<template>
  <div id="TextboxComponent" class="ui-textbox">

    <label v-if="this.$slots.default">
      <slot></slot>
    </label>

    <input :type="type"
    :value="value"
    @input="handleInput"
    @keyup="handleKeyup"
    @keydown.enter="handleEnter"
    @keydown="protectNumeric"
    :placeholder="placeholder"
    class="form-control"
    :style="icon?'padding-right: 32px':''"
    :disabled="disabled">

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
      type: {
        type: String,
        default: 'text',
      },

      value: {
        type: String,
        default: '',
      },

      placeholder: {
        type: String,
        default: '',
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

      onlyNumeric: {
        type: Boolean,
        default: false,
      },

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
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_handleInput">
      ************************/
      handleInput(event) {
        this.$emit('input', event.target.value);
      },

      /************************
      <id="_handleEnter">
      ************************/
      handleEnter(event) {
        this.$emit('enter');
      },

      /************************
      <id="_handleKeyup">
      ************************/
      handleKeyup(event) {
        this.$emit('keyup');
      },

      /************************
      <id="_protectNumeric">
      ************************/
      protectNumeric(event) {
        if (this.onlyNumeric) {
          // Allow: backspace, delete, tab, escape, enter and .
          if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
               // Allow: Ctrl+A
              (event.keyCode == 65 && event.ctrlKey === true) ||
               // Allow: Ctrl+C
              (event.keyCode == 67 && event.ctrlKey === true) ||
               // Allow: Ctrl+X
              (event.keyCode == 88 && event.ctrlKey === true) ||
               // Allow: home, end, left, right
              (event.keyCode >= 35 && event.keyCode <= 39)) {
                   // let it happen, don't do anything
                   return;
          }
          // Ensure that it is a number and stop the keypress
          if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
              event.preventDefault();
          }
        }
      },

    },

  }
</script>
