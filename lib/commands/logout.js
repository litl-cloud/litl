const chalk = require('chalk');
const { clearLogin } = require('../utils/session-helper');

module.exports = function () {
  clearLogin();

  console.log('');
  console.log(chalk.green('   Success') + ' - logged out');
  console.log('');
};
