import axios from 'axios';

export default new class {

  init() {
    return new Promise((resolve, reject) => {
      // var heroku = (process.env.HOME && process.env.HOME == '/app')?true:false;
      // // if (!localStorage.apiUrl)
      //   // localStorage.apiUrl = 'http://localhost:3000/api';
      // if (heroku)
        localStorage.apiUrl = 'https://oshopdev.herokuapp.com/api';
      // else 
      //   localStorage.apiUrl = 'http://localhost:3000/api';
        
      $.ajax({
        method: 'GET',
        cache: false,
        url: localStorage.apiUrl + '/system/config',

        success: (result) => {
          localStorage.apiKey = result.data.apiKey;

          if (!localStorage.archivesUrl)
            localStorage.archivesUrl = result.data.archivesUrl;

          resolve(result);
        },
      }).fail((result) => {
        reject(result);
      });

    });
  }

  post(url, data = {}) {
    return new Promise((resolve, reject) => {

      data.apiKey = localStorage.apiKey;
      if (localStorage.authKey)
        data.authKey = localStorage.authKey;

      url = localStorage.apiUrl + '/' + url;

      axios.post(url, data).then(result => {
        resolve(result.data);
      })
      .catch(result => {
        reject(result.data);
      });

    //   $.ajax({
    //     method: 'POST',
    //     cache: false,
    //     url,
    //     data,
    //
    //     success: (result) => {
    //
    //       // if denied re-init the apiKey
    //       if (result.state == 'denied') {
    //         this.init().then(_result => {
    //
    //           // re-call the api -------------------------------------------- //
    //
    //           data.apiKey = localStorage.apiKey;
    //           if (localStorage.authKey)
    //             data.authKey = localStorage.authKey;
    //
    //           $.ajax({
    //             method: 'POST',
    //             cache: false,
    //             url,
    //             data,
    //
    //             success: (result) => {
    //               resolve(result);
    //             }
    //           }).fail((result) => {
    //             reject(result);
    //           });
    //
    //           // ------------------------------------------------------------ //
    //
    //         }).catch(_result => {
    //           reject(result);
    //         });
    //       }
    //       else
    //         resolve(result);
    //     }
    //   }).fail((result) => {
    //     reject(result);
    //   });
    //
    });
  }

  put(url, data = {}) {
    return new Promise((resolve, reject) => {

      data.apiKey = localStorage.apiKey;
      if (localStorage.authKey)
        data.authKey = localStorage.authKey;

      url = localStorage.apiUrl + '/' + url;

      axios.put(url, data).then(result => {
        resolve(result.data);
      })
      .catch(result => {
        reject(result.data);
      });

      // $.ajax({
      //   method: 'PUT',
      //   cache: false,
      //   url,
      //   data,
      //
      //   success: (result) => {
      //
      //     // if denied re-init the apiKey
      //     if (result.state == 'denied') {
      //       this.init().then(_result => {
      //
      //         // re-call the api -------------------------------------------- //
      //
      //         data.apiKey = localStorage.apiKey;
      //         if (localStorage.authKey)
      //           data.authKey = localStorage.authKey;
      //
      //         $.ajax({
      //           method: 'POST',
      //           cache: false,
      //           url,
      //           data,
      //
      //           success: (result) => {
      //             resolve(result);
      //           }
      //         }).fail((result) => {
      //           reject(result);
      //         });
      //
      //         // ------------------------------------------------------------ //
      //
      //       }).catch(_result => {
      //         reject(result);
      //       });
      //     }
      //     else
      //       resolve(result);
      //   }
      // }).fail((result) => {
      //   reject(result);
      // });

    });
  }

  get(url, data = {}) {
    return new Promise((resolve, reject) => {

      data.apiKey = localStorage.apiKey;
      if (localStorage.authKey)
        data.authKey = localStorage.authKey;

      url = localStorage.apiUrl + '/' + url;

      axios.get(url, { params: data }).then(result => {
        resolve(result.data);
      }).catch(result => {
        reject(result.data);
      });

    });
  }

  delete(url, data = {}) {
    return new Promise((resolve, reject) => {

      data.apiKey = localStorage.apiKey;
      if (localStorage.authKey)
        data.authKey = localStorage.authKey;

      url = localStorage.apiUrl + '/' + url;

      axios.delete(url, { params: data }).then(result => {
        resolve(result.data);
      }).catch(result => {
        reject(result.data);
      });

    });
  }

}
