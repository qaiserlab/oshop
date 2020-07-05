<template>
  <div id="PanelComponent" class="ui-panel panel" :class="type?'panel-' + type:''">
    <div class="panel-heading">
      <h3 class="panel-title">
        <i v-if="loading" class="fa fa-spin fa-refresh"></i>
        <i v-else-if="icon" :class="'fa fa-' + icon"></i>
        {{ title }}
      </h3>
    </div>
    <div class="panel-body">
      <slot></slot>
    </div>
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
        default: '',
      },

      icon: {
        type: String,
        default: '',
      },

      title: {
        type: String,
        default: 'Panel',
      },

      loading: {
        type: Boolean,
        default: false,
      },

    },

  }
</script>
