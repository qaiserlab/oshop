module.exports = async function (req, res, next) {

  if (!req.session.authKey)
    return res.redirect('/404');
  else
    next();
};
