export default {
  namespaced: true,

  state: {
    rs: [
      { id: 'Draft' },
      { id: 'Publish' },
    ],
  },

  getters: {

    rs(state) {
      return state.rs;
    },

  },

}
