<template>
  <div id="TextareaComponent" class="ui-textarea">

    <label v-if="this.$slots.default">
      <slot></slot>
    </label>

    <textarea :value="value"
    class="form-control"
    @input="handleInput"
    @keyup="handleKeyup"
    :placeholder="placeholder"
    :rows="size"
    :disabled="disabled || loading"></textarea>

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

      placeholder: {
        type: String,
        default: '',
      },

      size: {
        type: String,
        default: '8',
      },

      disabled: {
        type: Boolean,
        default: false,
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

    },
  }
</script>
