export default {
  namespaced: true,

  state: {
    rs: [
      { id: 'All Size' },
      { id: 'XS' },
      { id: 'S' },
      { id: 'M' },
      { id: 'L' },
      { id: 'XL' },
      { id: 'XXL' },
      { id: 'XXXL' },
      { id: '36' },
      { id: '37' },
      { id: '38' },
      { id: '39' },
      { id: '40' },
      { id: '41' },
      { id: '42' },
      { id: '43' },
      { id: '44' },
    ],
  },

  getters: {

    rs(state) {
      return state.rs;
    },

  },

}
