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

    fetchData({ commit }, data) {
      console.log(data);
      return new Promise((resolve, reject) => {
        api.get('report/bonus-transfer-history', data).then(result => {

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

        api.post('report/bonus-transfer-history', data).then(result => {
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

        api.put('bonus-transfer-history/' + state.rowActive._id, data).then(result => {
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
        api.delete('bonus-transfer-history/' + state.rowActive._id).then(result => {
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
      var lastSaldo = 0;

      return state.rs.map(row => {
        row.member_ID = row.memberId;
        row.tanggal = row.date_;
        row.kredit = row.credit;
        row.keterangan = row.description;

        row.saldo = lastSaldo + row.credit - row.debit;
        lastSaldo = row.saldo;
        return row;
      });
    },

    rowActive(state) {
      return state.rowActive;
    },

  },

}
