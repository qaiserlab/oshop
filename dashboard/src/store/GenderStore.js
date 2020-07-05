export default {
  namespaced: true,

  state: {
    rs: [
      { id: 'Male' },
      { id: 'Female' },
    ],
  },

  getters: {

    rs(state) {
      return state.rs;
    },

  },

}
