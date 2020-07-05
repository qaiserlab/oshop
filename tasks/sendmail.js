

// <?php
// $url = 'https://api.elasticemail.com/v2/email/send';
//
// try{
//         $post = array('from' => 'youremail@yourdomain.com',
// 		'fromName' => 'Your Company Name',
// 		'apikey' => '00000000-0000-0000-0000-000000000000',
// 		'subject' => 'Your Subject',
// 		'to' => 'recipient1@gmail.com;recipient2@gmail.com',
// 		'bodyHtml' => '<h1>Html Body</h1>',
// 		'bodyText' => 'Text Body',
// 		'isTransactional' => false);
//
// 		$ch = curl_init();
// 		curl_setopt_array($ch, array(
//             CURLOPT_URL => $url,
// 			CURLOPT_POST => true,
// 			CURLOPT_POSTFIELDS => $post,
//             CURLOPT_RETURNTRANSFER => true,
//             CURLOPT_HEADER => false,
// 			CURLOPT_SSL_VERIFYPEER => false
//         ));
//
//         $result=curl_exec ($ch);
//         curl_close ($ch);
//
//         echo $result;
// }
// catch(Exception $ex){
// 	echo $ex->getMessage();
// }
// ?>

var axios = require('axios');

var url = 'https://api.elasticemail.com/v2/email/send';
var data = {
  'from': 'f.anaturdasa@gmail.com',
  'fromName': 'Roni',
  'apikey': 'e4526bb3-8641-484f-80fa-6e5138cd1157',
  'subject': 'Percobaan',
  'to': 'f.anaturdasa@qaiserlab.com;ulaslinux@gmail.com;svtmumgil@gmail.com',
  'bodyHtml': '<h1>Html Body ini pesen utk mama</h1>',
  'bodyText': 'Text Body',
  'isTransactional': false,
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
