export default {
  namespaced: true,

  state: {
    rs: [
      { id: 'Default' },
      { id: 'Profile' },
      { id: 'InfoLayanan' },
      { id: 'Contact' },
    ],
  },

  getters: {

    rs(state) {
      return state.rs;
    },

  },

}
