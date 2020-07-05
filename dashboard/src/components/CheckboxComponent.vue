<template>
  <div id="CheckboxComponent" class="ui-checkbox">
    <label v-if="this.$slots.default">
      <slot></slot>
    </label>

    <label class="checkbox-inline" v-for="row in dataSource">
      <input :name="name_"
      type="checkbox"
      @input="handleInput"
      :value="row[dataValue]"
      :checked="isChecked(row[dataValue])"
      :disabled="disabled || loading">
      {{ row[dataField] }}
    </label>
  </div>
</template>

<script>
  export default {

    /************************
    <id="_props">
    ************************/
    props: {

      dataSource: {
        type: Array,
        default: () => [],
      },

      dataValue: {
        type: String,
        default: 'id',
      },

      dataField: {
        type: String,
        default: 'id',
      },

      value: {
        type: Array,
        default: () => [],
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
    <id="_data">
    ************************/
    data() {
      return {
        name_: 'checkbox-' + Math.random(),
      };
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_isChecked">
      ************************/
      isChecked(value) {
        let checked = false;

        this.value.forEach((value_) => {
          if (value == value_)
            checked = true;
        });

        return checked;
      },

      /************************
      <id="_handleInput">
      ************************/
      handleInput(event) {

        if (!this.isChecked(event.target.value)) {
          let value = this.value;
          value.push(event.target.value);
        }
        else {
          let value_ = this.value;
          let value = [];

          value_.forEach((value__) => {
            if (value__ != event.target.value)
              value.push(value__);
          });
        }

        this.$emit('input', value);
      },
    },
  }
</script>
