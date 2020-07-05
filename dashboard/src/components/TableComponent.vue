<template>
  <div id="TableComponent" class="ui-table">
    <!-- <i v-if="loading" class="fa fa-spin fa-refresh"></i> -->
    <table class="table" :class="type_ + ' ' + (hover?'table-hover':'')">
      <slot></slot>
      <tbody v-if="dataSource.length > 0">
        <tr v-for="row in dataSource">
          <td v-for="(field, key) in row" v-if="key != dataValue" v-html="field"></td>
        </tr>
      </tbody>
    </table>
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

      value: {
        type: String,
        default: '',
      },

      type: {
        type: String,
        default: '',
      },

      hover: {
        type: Boolean,
        default: false,
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
      <id="_type_">
      ************************/
      type_() {
        if (this.type)
          return 'table-' + this.type;
        else
          return '';
      },

    },

  }
</script>
