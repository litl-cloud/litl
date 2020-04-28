const chalk = require('chalk');
const { getLogin, isLoggedIn } = require('../utils/session-helper');

module.exports = async function () {
  const session = getLogin();

  console.log();
  if (isLoggedIn(session)) {
    console.log(lpad(`you are currently logged in as ${chalk.bold(session.login)}`));
    console.log(lpad('if you wish to login as different user, logout and login again'));
  } else {
    console.log(lpad(`you aren't logged in`));
  }
  console.log();
};

function lpad(str) {
  return '   ' + str;
}
