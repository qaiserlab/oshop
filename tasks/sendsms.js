var axios = require('axios');

var url = 'https://api.elasticemail.com/sms/send';
var data = {
  'apiKey': 'e4526bb3-8641-484f-80fa-6e5138cd1157',
  'to': '+6282183936455',
  'body': 'ini pesan saya dari elasticemail',
};

var param = '';
var i = 0;

Object.keys(data).forEach(key => {
  i++; if (i == 1) var indicator = '?'; else var indicator = '&';
  param += indicator + key + '=' + encodeURIComponent(data[key]);
});

url += param;
console.log(url);

axios.post(url, data).then(response => {
  console.log('sukses');
  console.log(response);
}).catch(response => {
  console.log('gagal');
  console.log(response);
});
