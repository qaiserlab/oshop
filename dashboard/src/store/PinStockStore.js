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
      data.forEach(row => {
        state.rs.push(row);
      });
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
        api.get('pin-stock', {
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

        api.post('pin-stock', data).then(result => {
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

        api.put('pin-stock/' + state.rowActive._id, data).then(result => {
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
        api.delete('pin-stock/' + state.rowActive._id).then(result => {
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
      let balance = 0;

      return state.rs.map(row => {

        let date = new Date(row.date);
        row.date_ = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        row.tanggal = row.date_;

        row.member_ID = row.memberId;
        row.keterangan = row.description;

        row.masuk = row.in;
        row.keluar = row.keluar;

        balance += (row.in - row.out);
        row.balance = balance;

        row.sisa = row.balance;

        return row;
      });
    },

    rowActive(state) {
      return state.rowActive;
    },

  },

}
