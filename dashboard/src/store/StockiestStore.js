export default {
  namespaced: true,

  state: {
    rs: [],
    rowActive: {},
  },

  mutations: {

    setDataSource(state, dataSource) {
      state.rs = dataSource;
    },

    addData(state, data) {
      state.rs.push(data);
    },

    setData(state, data) {

      let newData = {
        ...state.rs[state.rowActive.index],
        ...data,
      };

      state.rs.splice(state.rowActive.index, 1, newData);
    },

    removeData(state) {
      state.rs.splice(state.rowActive.index, 1);
      state.rowActive = {};
    },

    setRowActiveByIndex(state, index) {
      let rowActive = state.rs[index];
      rowActive.index = index;

      state.rowActive = rowActive;
    },

    setRowActiveById(state, id) {

      let rowActive = {};
      let i = -1;

      state.rs.forEach(row => {
        i++;

        if (row._id == id) {
          rowActive = row;
          rowActive.index = i;
        }

      });

      state.rowActive = rowActive;
    },

  },

  actions: {

    fetchData({ commit }) {
      return new Promise((resolve, reject) => {
        api.get('stockiest', {
          find: 'All',
        }).then(result => {

          if (result.state == 'success') {
            commit('setDataSource', result.data);
            resolve(result);
          } else
            reject(result);
        });
      });
    },

    moveFirstData({ commit }) {
      commit('setRowActiveByIndex', 0);
    },

    moveLastData({ state, commit }) {
      commit('setRowActiveByIndex', state.rs.length - 1);
    },

    moveData({ commit }, id) {
      commit('setRowActiveById', id);
    },

    createData({ commit }, data) {
      return new Promise((resolve, reject) => {

        api.post('stockiest', data).then(result => {
          if (result.state == 'success') {
            commit('addData', result.data);
            resolve(result);
          }
          else
            reject(result);
        });

      });
    },

    updateData({ state, commit }, data) {
      return new Promise((resolve, reject) => {

        api.put('stockiest/' + state.rowActive._id, data).then(result => {
          if (result.state == 'success') {
            commit('setData', result.data);
            resolve(result);
          }
          else
            reject(result);
        });

      });
    },

    deleteData({ state, commit }, id) {
      return new Promise((resolve, reject) => {
        api.delete('stockiest/' + state.rowActive._id).then(result => {
          if (result.state == 'success')
            resolve(result);
          else
            reject(result);
        });

        commit('removeData');
      });
    },

  },

  getters: {

    rs(state) {
      return state.rs.map(row => {

        row.member_ID = row.memberId;

        let fullName =  row.member.firstName;
        if (row.member.lastName)
          fullName += ' ' + row.member.lastName;

        row.fullName = fullName;
        row.nama_Lengkap = row.fullName;
        row.email = row.member.email;
        row.phoneNumber = row.member.phoneNumber;
        row.no_Telp = row.phoneNumber;

        // let date = new Date(row.member.registeredOn);
        // row.member.registeredOn_ = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

        return row;
      });
    },

    rsDistributionCenter(state, getters) {
      return getters.rs.filter(row => row.type == 'Distribution Center');
    },

    rsMobileCenter(state, getters) {
      return getters.rs.filter(row => row.type == 'Mobile Center');
    },

    rowActive(state) {
      return state.rowActive;
    },

  },

}
