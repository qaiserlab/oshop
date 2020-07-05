export default {
  namespaced: true,

  state: {
    rs: [
      { id: 'Distribution Center' },
      { id: 'Mobile Center' },
    ],
  },

  getters: {

    rs(state) {
      return state.rs;
    },

  },

}
