export default {
  namespaced: true,

  state: {
    rs: [],
    rowActive: {},
    // filtered: {
    //   proced: false,
    //   by: {},
    // },
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

        api.get('stockiest-order', {
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

        api.post('order', data).then(result => {
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

        api.put('stockiest-order/' + state.rowActive._id, data).then(result => {
          if (result.state == 'success') {
            commit('setData', result.data);
            resolve(result);
          }
          else
            reject(result);
        });

      });
    },

    setState({ state, commit }, data) {
      return new Promise((resolve, reject) => {

        api.put('stockiest-order/state/' + state.rowActive._id, data).then(result => {
          if (result.state == 'success') {
            commit('setData', result.data);
            resolve(result);
          }
          else
            reject(result);
        });

      });
    },

    confirmData({ state, commit }, data) {
      return new Promise((resolve, reject) => {

        api.put('order/confirm/' + state.rowActive._id).then(result => {
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
        api.delete('order/stockiest-order/' + state.rowActive._id).then(result => {
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

        // row.member = row.memberName + '/' + row.memberId;
        //
        // row.shipTo = row.firstName;
        // if (row.lastName)
        //   row.shipTo += ' ' + row.lastName;
        //
        // row.shippingAddress = row.address;
        //
        // // Total

        let totalItems = 0;
        let total = 0;

        row.cart.forEach(row => {
          totalItems += row.qty;
          total += parseInt(row.qty) * parseInt(row.price);
        });

        row.cart = row.cart.map(row_ => {
          row_.price_ = 'Rp' + row_.price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          row_.subTotal = row_.qty * row_.price;
          row_.subTotal_ = 'Rp' + row_.subTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          return row_;
        });

        row.totalItems = totalItems;
        row.total = total;
        row.total_ = 'Rp' + total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        //
        // if (!row.shipmentCost)
        //   row.shipmentCost = 0;
        //
        // total += row.shipmentCost + parseInt(row.uniqueCode)
        //
        // row.totalItems = totalItems;
        // row.total = total;
        // row.total_ = 'Rp' + total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        //
        // // End Total
        //
        // row.shipmentCost_ = 'Rp' +  row.shipmentCost.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        //
        // if (row.dropship.isDropship)
        //   row.isDropship = 'Yes';
        // else
        //   row.isDropship = 'No';
        //
        let orderDate = new Date(row.orderDate);
        row.orderDate_ = orderDate.getDate() + "/" + (orderDate.getMonth() + 1) + "/" + orderDate.getFullYear();

        let dueDate = new Date(row.dueDate);
        row.dueDate_ = dueDate.getDate() + "/" + (dueDate.getMonth() + 1) + "/" + dueDate.getFullYear();

        return row;
      });

      rs.sort((a, b) => {
        return new Date(b.orderDate) - new Date(a.orderDate);
      });

      return rs;
    },

    rsPending(state, getters) {
      return getters.rs.filter(row => row.status == 'Pending' && (Date.now() < new Date(row.dueDate)));
    },

    rsConfirmed(state, getters) {
      return getters.rs.filter(row => row.status == 'Confirmed');
    },

    rsProcessed(state, getters) {
      return getters.rs.filter(row => row.status == 'Processed');
    },

    rsDelivered(state, getters) {
      return getters.rs.filter(row => row.status == 'Delivered');
    },

    rsPaid(state, getters) {
      return getters.rs.filter(row => row.status == 'Paid');
    },

    rsExpired(state, getters) {
      return getters.rs.filter(row => row.status == 'Pending' && (Date.now() >= new Date(row.dueDate)));
    },

    rsLatestOrder(state, getters) {
      let range = 10;
      let i = 0;

      return getters.rs.filter(row => {
        i++;
        if (i > range)
          return false;
        else
          return row._id != getters.rowActive._id;
      });
    },

    rowActive(state) {
      return state.rowActive;
    },

  },

}
