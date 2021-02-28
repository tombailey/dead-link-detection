const validator = require('validator');

function isValidLink(url) {
  return (
    validator.isURL(url, {
      require_protocol: true,
    }) &&
    validator.isFQDN(url.split('/')[2])
  );
}

module.exports = {
  isValidLink,
};