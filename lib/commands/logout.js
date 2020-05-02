const chalk = require('chalk');
const { clearLogin } = require('../utils/session-helper');
const { print } = require('../utils/console-helper');

module.exports = function () {
  clearLogin();

  print();
  print(chalk.green('Success') + ' - logged out');
  print();
};
