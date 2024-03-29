export default {
  namespaced: true,

  state: {
    rs: [],
    rowActive: {},
    filtered: {
      proced: false,
      by: {},
    },
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
        console.log(row.settingId + ' = ' + id);
        if (row.settingId == id) {
          rowActive = row;
          rowActive.index = i;
        }

      });

      state.rowActive = rowActive;
    },

    setFilter(state, data) {
      state.filtered = {
        proced: true,
        by: data,
      };
    },

    resetFilter(state) {
      state.filtered.proced = false;
    },

  },

  actions: {

    fetchData({ commit }) {
      return new Promise((resolve, reject) => {

        api.get('setting', {
          find: 'All',
        }).then(result => {

          if (result.state == 'success') {
            commit('setDataSource', result.data);
            commit('resetFilter');

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

        api.post('setting', data).then(result => {
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

        api.put('setting', data).then(result => {
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
        api.delete('setting/' + state.rowActive._id).then(result => {
          if (result.state == 'success')
            resolve(result);
          else
            reject(result);
        });

        commit('removeData');
      });
    },

    filterBy({ commit }, data) {
      commit('setFilter', data);
    },

  },

  getters: {

    rs(state) {
      let rs = state.rs.map(row => {

        row.judul = row.title;
        row.publikasi = row.publication;

        let date = new Date(row.postedOn);
        row.postedOn_ = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

        row.tanggal = row.postedOn_;

        return row;
      });

      if (state.filtered.proced) {
        rs = rs.filter(row => {
          if (state.filtered.by.template == row.template)
            return true;
        });
      }

      return rs;
    },

    rowActive(state) {
      return state.rowActive;
    },

  },

}
