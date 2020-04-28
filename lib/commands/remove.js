const chalk = require('chalk');
const { isLoggedIn } = require('../utils/session-helper');
const login = require('./login');
const removeDomain = require('../utils/remove-project');

module.exports = async function () {
  if (!isLoggedIn()) {
    console.log();
    console.log(chalk.blue('   Welcome !!'));
    await login();
  }

  const domain = '';

  try {
    await removeDomain(domain);
    console.log();
    console.log(chalk.green('   Success: ') + 'project removed.');
    console.log();
  } catch (error) {
    console.log();
    console.log(chalk.red('   Error: ') + 'failed to remove the project.');
    console.log();
    process.exit(0);
  }
};
