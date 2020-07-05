var axios = require('axios');

function serialize(data) {
  var param = '';
  var i = 0;

  Object.keys(data).forEach(key => {
    i++; if (i == 1) var indicator = '?'; else var indicator = '&';
    param += indicator + key + '=' + encodeURIComponent(data[key]);
  });

  return param;
}

exports.sendMail = function (to_, subject, bodyHtml) {

  var to = to_.join(';');

  var url = 'https://api.elasticemail.com/v2/email/send';
  var data = {
    'from': 'f.anaturdasa@gmail.com',
    'fromName': 'Oshop Network',
    // 'apikey': 'e4526bb3-8641-484f-80fa-6e5138cd1157',
    'apikey': 'fffe1604-239f-42d8-b990-702253d2e370',
    subject,
    to,
    bodyHtml,
    // 'bodyText': 'Text Body',
    'isTransactional': false,
  };

  url += serialize(data);
  // console.log(url);

  axios.post(url, data).then(response => {
    console.log('sukses');
    // console.log(response);
  }).catch(response => {
    console.log('gagal');
    // console.log(response);
  });
};

exports.sendMailSpecific = function (from, fromName, to_, subject, bodyHtml) {

  var to = to_.join(';');

  var url = 'https://api.elasticemail.com/v2/email/send';
  var data = {
    'from': from,
    'fromName': fromName,
    // 'apikey': 'e4526bb3-8641-484f-80fa-6e5138cd1157',
    'apikey': 'fffe1604-239f-42d8-b990-702253d2e370',
    subject,
    to,
    bodyHtml,
    // 'bodyText': 'Text Body',
    'isTransactional': false,
  };

  url += serialize(data);
  // console.log(url);

  axios.post(url, data).then(response => {
    console.log('sukses');
    // console.log(response);
  }).catch(response => {
    console.log('gagal');
    // console.log(response);
  });
};

exports.sendSms = function (nohp, pesan) {

  console.log('no hp: ' + nohp + ' || pesan: ' + pesan);
// userkey=r9om41&passkey=c0zm33dn3t
  var url = 'https://reguler.zenziva.net/apps/smsapi.php';
  var data = {
    userkey: 'r9om41',
    passkey: 'c0zm33dn3t',
    nohp,
    tipe: 'reguler',
    pesan,
  };

  url += serialize(data);
  console.log(url);

  axios.post(url).then(response => {
    console.log('sukses');
    console.log(response);
  }).catch(response => {
    console.log('gagal');
    console.log(response);
  });
};
