var sha1 = require('sha1');
var shortid = require('shortid');

exports.cryptPassword = function (password) {
  return sha1(password);
};

exports.uniqid = function () {
  var n = Math.floor(Math.random()*11);
  var k = Math.floor(Math.random()* 1000000);
  var m = String.fromCharCode(n)+k;

  return m;
};

exports.shortid = function () {
  shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
  return shortid.generate().toUpperCase();
};

exports.random3digit = function () {
  var random5number = Math.floor(Math.random()*90000) + 10000;
  var random3number = parseInt(random5number.toString().substr(0, 3));
  return random3number;
};
