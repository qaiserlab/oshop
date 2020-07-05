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
        api.get('member', {
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

        api.post('member', data).then(result => {
          if (result.state == 'success') {
            commit('addData', result.data);
            resolve(result);
          }
          else
            reject(result);
        });

      });
    },

    updateData({ state, commit, actions }, data) {
      return new Promise((resolve, reject) => {

        api.put('member/' + state.rowActive._id, data).then(result => {
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
        api.delete('member/' + state.rowActive._id).then(result => {
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

        let fullName =  row.firstName;
        if (row.lastName)
          fullName += ' ' + row.lastName;

        let date = new Date(row.registeredOn);

        row.fullName = fullName;
        row.registeredOn_ = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

        row.username = row.memberId;
        row.nama_Lengkap = row.fullName;
        row.tanggal = row.registeredOn_;

        return row;
      });
    },

    rsFreeActive(state, getters) {
      return getters.rs.filter(row => {
        if (row.memberType == 'Free' && row.activation == 'Active')
          return true;
      });
    },

    rsFreeInactive(state, getters) {
      return getters.rs.filter(row => {
        if (row.memberType == 'Free' && row.activation == 'Inactive')
          return true;
      });
    },

    rsFreePending(state, getters) {
      return getters.rs.filter(row => {
        if (row.memberType == 'Free' && row.activation == 'Pending')
          return true;
      });
    },

    rsPremiumActive(state, getters) {
      return getters.rs.filter(row => {
        if (row.memberType == 'Premium' && row.activation == 'Active')
          return true;
      });
    },

    rsPremiumInactive(state, getters) {
      return getters.rs.filter(row => {
        if (row.memberType == 'Premium' && row.activation == 'Inactive')
          return true;
      });
    },

    rsPremiumPending(state, getters) {
      return getters.rs.filter(row => {
        if (row.memberType == 'Premium' && row.activation == 'Pending')
          return true;
      });
    },

    rsPremiumConfirmed(state, getters) {
      return getters.rs.filter(row => {
        if (row.memberType == 'Premium' && row.activation == 'Confirmed')
          return true;
      });
    },

    rowActive(state) {
      return state.rowActive;
    },

  },

}
