var sha1 = require('sha1');

// var baseUrl = 'http://localhost:3000';
var baseUrl = 'https://oshopdev.herokuapp.com';

module.exports = {
  baseUrl,
  archivesUrl: baseUrl + '/writable/archives',
  tmpUrl: baseUrl + '/writable/tmp',
  apiKey: sha1(Date.now()),
};
