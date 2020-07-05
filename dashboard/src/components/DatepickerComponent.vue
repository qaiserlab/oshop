<template>
  <div id="DatepickerComponent" class="ui-datepicker">

    <label v-if="this.$slots.default">
      <slot></slot>
    </label>

    <span v-if="type == 'daily'">
      <select class="form-control"
      @input="handleInputDay"
      :value="dayValue"
      :disabled="disabled || loading">
        <option v-for="day in days"
        :selected="day == dayValue">{{ day }}</option>
      </select>

      <select class="form-control"
      @input="handleInputMonth"
      :value="monthValue"
      :disabled="disabled || loading">
        <option v-for="(month, index) in months"
        :value="index + 1"
        :selected="(index + 1) == monthValue">{{ month }}</option>
      </select>

      <select class="form-control"
      @input="handleInputYear"
      :value="yearValue"
      :disabled="disabled || loading">
        <option v-for="year in years"
        :selected="year == yearValue">{{ year }}</option>
      </select>
    </span>

    <span v-if="type == 'monthly'">

      <select class="form-control"
      @input="handleInputYear"
      :value="yearValue"
      :disabled="disabled || loading">
        <option v-for="year in years"
        :selected="year == yearValue">{{ year }}</option>
      </select>

      <select class="form-control"
      @input="handleInputMonth"
      :value="monthValue"
      :disabled="disabled || loading">
        <option v-for="(month, index) in months"
        :value="index + 1"
        :selected="(index + 1) == monthValue">{{ month }}</option>
      </select>

    </span>

    <span v-if="type == 'yearly'">
      <select class="form-control"
      @input="handleInputYear"
      :value="yearValue"
      :disabled="disabled || loading">
        <option v-for="year in years"
        :selected="year == yearValue">{{ year }}</option>
      </select>
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
        default: '2011-1-1',
      },

      type: {
        type: String,
        default: 'daily',
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
    <id="_computed">
    ************************/
    computed: {

      /************************
      <id="_dayValue">
      ************************/
      dayValue() {
        let xValue = this.value.split('-');
        return xValue[2];
      },

      /************************
      <id="_monthValue">
      ************************/
      monthValue() {
        let xValue = this.value.split('-');
        return xValue[1];
      },

      /************************
      <id="_yearValue">
      ************************/
      yearValue() {
        let xValue = this.value.split('-');
        return xValue[0];
      },

      /************************
      <id="_days">
      ************************/
      days() {
        let days = [];

        for (let i = 1; i <= 31; i++) {
          days.push(i);
        }

        return days;
      },

      /************************
      <id="_months">
      ************************/
      months() {
        return [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];
      },

      /************************
      <id="_years">
      ************************/
      years() {
        let years = [];

        for (let i = 1985; i <= 2047; i++) {
          years.push(i);
        }

        return years;
      },
    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_handleInputDay">
      ************************/
      handleInputDay(event) {
        let value = this.yearValue + '-' + this.monthValue + '-' + event.target.value;
        this.$emit('input', value);
      },

      /************************
      <id="_handleInputMonth">
      ************************/
      handleInputMonth(event) {
        let value = this.yearValue + '-' + event.target.value + '-' + this.dayValue;
        this.$emit('input', value);
      },

      /************************
      <id="_handleInputYear">
      ************************/
      handleInputYear(event) {
        let value = event.target.value + '-' + this.monthValue + '-' + this.dayValue;
        this.$emit('input', value);
      },

    },
  }
</script>
