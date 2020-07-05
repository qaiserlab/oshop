module.exports = function (req, res, next) {
  if (req.get('apiKey') != 'c0zm33d-p1a')
    return res.json({
      state: 'failed',
      message: 'Akses tidak diizinkan',
    });
  else
    next();
}
