module.exports = function (req, res, next) {
  if (req.headers.apiKey != 'c0zm33d-p1a') 
    return res.status(500).send({ auth: false, message: 'Invalid API Key' });
  else
    next();
}
