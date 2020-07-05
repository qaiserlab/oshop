export default {
  namespaced: true,

  state: {
    row: {
      authKey: '',
      memberId: '',
      email: '',
      phoneNumber: '',
      fullName: '',
      photo: '',
    },
  },

  mutations: {

    setDataSource(state, dataSource) {
      state.row = {
        authKey: dataSource.authKey,
        memberId: dataSource.memberId,
        email: dataSource.email,
        phoneNumber: dataSource.phoneNumber,
        fullName: dataSource.fullName,
        photo: dataSource.photo,
      };
    },

  },

  actions: {

    reload({ commit }) {
      commit('setDataSource', {
        authKey: localStorage.authKey,
        memberId: localStorage.memberId,
        email: localStorage.email,
        phoneNumber: localStorage.phoneNumber,
        fullName: localStorage.fullName,
        photo: localStorage.photo,
      });
    },

    login({ commit }, data) {
      return new Promise((resolve, reject) => {
        api.post('account/login', data).then(result => {

          if (result.state == 'success') {

            localStorage.authKey = result.data.authKey;
            localStorage.memberId = result.data.memberId;
            localStorage.email = result.data.email;
            localStorage.phoneNumber = result.data.phoneNumber;
            localStorage.fullName = result.data.fullName;
            localStorage.photo = result.data.photo;

            commit('setDataSource', {
              authKey: localStorage.authKey,
              memberId: localStorage.memberId,
              email: localStorage.email,
              phoneNumber: localStorage.phoneNumber,
              fullName: localStorage.fullName,
              photo: localStorage.photo,
            });
            resolve(result);
          } else
            reject(result);
        });
      });
    },

    logout({ commit }) {
      return new Promise((resolve, reject) => {
        api.post('account/logout', { email: localStorage.email }).then(result => {

          if (result.state == 'success') {

            localStorage.authKey = '';
            localStorage.memberId = '';
            localStorage.email = '';
            localStorage.phoneNumber = '';
            localStorage.fullName = '';
            localStorage.photo = '';

            commit('setDataSource', {
              authKey: localStorage.authKey,
              memberId: localStorage.memberId,
              email: localStorage.email,
              phoneNumber: localStorage.phoneNumber,
              fullName: localStorage.fullName,
              photo: localStorage.photo,
            });
            resolve(result);
          } else
            reject(result);
        });
      });
    },

    reset({ commit }) {
      localStorage.authKey = '';
      localStorage.memberId = '';
      localStorage.email = '';
      localStorage.phoneNumber = '';
      localStorage.fullName = '';
      localStorage.photo = '';

      commit('setDataSource', {
        authKey: localStorage.authKey,
        memberId: localStorage.memberId,
        email: localStorage.email,
        phoneNumber: localStorage.phoneNumber,
        fullName: localStorage.fullName,
        photo: localStorage.photo,
      });
    },

    updateProfile({ state, commit, actions }, data) {
      return new Promise((resolve, reject) => {

        api.put('account/update-user-profile/' + localStorage.authKey, data).then(result => {
          if (result.state == 'success') {
            commit('setData', result.data);

            localStorage.email = result.data.email;
            localStorage.phoneNumber = result.data.phoneNumber;
            localStorage.fullName = result.data.fullName;
            localStorage.photo = result.data.photo;

            commit('setDataSource', {
              authKey: localStorage.authKey,
              memberId: localStorage.memberId,
              email: localStorage.email,
              phoneNumber: localStorage.phoneNumber,
              fullName: localStorage.fullName,
              photo: localStorage.photo,
            });

            resolve(result);
          }
          else
            reject(result);
        });

      });
    },

    // updatePassword({ state, commit, actions }, data) {
    //   return new Promise((resolve, reject) => {
    //
    //     api.put('account/update-user-password/' + localStorage.authKey, data).then(result => {
    //       if (result.state == 'success') {
    //         commit('setData', result.data);
    //
    //         localStorage.email = result.data.email;
    //         localStorage.phoneNumber = result.data.phoneNumber;
    //         localStorage.fullName = result.data.fullName;
    //         localStorage.photo = result.data.photo;
    //
    //         commit('setDataSource', {
    //           authKey: localStorage.authKey,
    //           memberId: localStorage.memberId,
    //           email: localStorage.email,
    //           phoneNumber: localStorage.phoneNumber,
    //           fullName: localStorage.fullName,
    //           photo: localStorage.photo,
    //         });
    //
    //         resolve(result);
    //       }
    //       else
    //         reject(result);
    //     });
    //
    //   });
    // },

  },

  getters: {

    isAuthen(state) {
      return (state.row.authKey?true:false);
    },

    myAccount(state) {
      return state.row;
    },

  },

}
