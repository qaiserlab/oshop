var mongoose = require('mongoose');

var MenuModel = mongoose.model('Menu');
var ImageModel = mongoose.model('Image');
var BannerModel = mongoose.model('Banner');

function titleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

module.exports = async function (req, res, next) {

  if (!req.session.cart)
    req.session.cart = [];

  var url = req.url;
  var xUrl = url.split('/');
  var titleSlug = xUrl[xUrl.length - 1].split('?')[0];

  if (!titleSlug)
    var title = 'Cozmeed';
  else
    var title = titleCase(titleSlug.replace(/-/g, ' '));

  var topMenu = await MenuModel.findOne({ slug: 'top-menu' });
  var bottomMenu1 = await MenuModel.findOne({ slug: 'bottom-menu-1' });
  var bottomMenu2 = await MenuModel.findOne({ slug: 'bottom-menu-2' });
  var bottomMenu3 = await MenuModel.findOne({ slug: 'bottom-menu-3' });

  var topLogo = await ImageModel.findOne({ slug: 'top-logo' });
  var bottomLogo = await ImageModel.findOne({ slug: 'bottom-logo' });

  var rsBanner = await BannerModel.find({ publication: 'Publish' });

  res.locals = {
    session: req.session,
    currentUrl: req.originalUrl,

    site: {
      title,
    },

    topMenu,
    bottomMenu1,
    bottomMenu2,
    bottomMenu3,

    topLogo,
    bottomLogo,
    rsBanner,
  };
  next();
};
