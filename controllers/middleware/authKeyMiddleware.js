const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  let data = req.headers;

  jwt.verify(data.authKey, data.apiKey, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token' });
    else next();
  });

}
