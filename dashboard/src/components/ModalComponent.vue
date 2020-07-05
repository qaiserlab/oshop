<template>
  <div id="ModalComponent" class="ui-modal">

    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div v-if="display" class="modal" style="display: block; z-index: 10000">
      <div @click="handleClose" class="overlay"></div>

      <div class="modal-dialog">

        <div class="modal-content">
          <div class="modal-header">
            <button @click="handleClose" type="button" class="close">
              <i class="fa fa-close"></i>
            </button>
            <h4 class="modal-title">
              <i v-if="icon" class="fa" :class="'fa-' + icon"></i>
              {{ title }}
            </h4>
          </div>
          <div class="modal-body">
            <slot name="message"></slot>
          </div>
          <div class="modal-footer">
            <slot name="buttonbar"></slot>
          </div>
        </div>

      </div>
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

      title: {
        type: String,
        default: 'Title',
      },

      display: {
        type: Boolean,
        default: false,
      },

      icon: {
        type: String,
        default: '',
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
