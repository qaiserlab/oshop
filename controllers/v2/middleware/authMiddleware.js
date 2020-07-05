const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

  var apiKey = req.get('apiKey');
  var authKey = req.get('authKey');

  if (!authKey)
    return res.json({
      state: 'failed',
      message: 'Akses tidak diizinkan',
    });

  jwt.verify(authKey, apiKey, function(err, decoded) {
    if (err)
      return res.json({
        state: 'failed',
        message: 'Akses tidak diizinkan',
      });

    req.decoded = decoded;
    next();
  });

}
