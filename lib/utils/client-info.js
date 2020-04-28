const os = require('os');
const logger = require('loglevel');
const pkg = require('../../package.json');

function getPlatformInfo() {
  try {
    let platform = os.type();
    if (platform === 'Darwin') {
      platform = 'Mac';
    } else if (platform === 'Windows_NT') {
      platform = 'Windows';
    }
    return os.hostname() + ',' + platform;
  } catch (error) {
    logger.debug('error getting platform info', { error });
    return '';
  }
}

function getUserAgent() {
  try {
    return `${pkg.name}/${pkg.version}`;
  } catch (error) {
    logger.debug('error getting user agent', { error });
    return '';
  }
}

module.exports = {
  getPlatformInfo,
  getUserAgent,
};
