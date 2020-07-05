var fs = require('fs');

exports.save = function (tmpImage, newImage) {

  if (tmpImage) {
    if (fs.existsSync('public/writable/tmp/' + tmpImage)) {
      newImage += '.png';

      console.log('TMP: ' + tmpImage);
      console.log('NEW: ' + newImage);

      fs.renameSync(
        'public/writable/tmp/' + tmpImage,
        'public/writable/archives/' + newImage
      );

      return newImage;
    }
  }

  return tmpImage;
};

exports.remove = function (image) {

  if (image) {
    if (fs.existsSync('public/writable/archives/' + image))
      fs.unlinkSync('public/writable/archives/' + image);
  }

};
