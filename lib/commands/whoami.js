const chalk = require('chalk');
const { getLogin, isLoggedIn } = require('../utils/session-helper');
const { print } = require('../utils/console-helper');

module.exports = async function () {
  const session = getLogin();

  print();
  if (isLoggedIn(session)) {
    print(`you are currently logged in as ${chalk.bold(session.login)}`);
    print('if you wish to login as different user, logout and login again');
  } else {
    print(`you aren't logged in`);
  }
  print();
};
