const chalk = require('chalk');
const { isLoggedIn } = require('../utils/session-helper');
const login = require('./login');
const removeDomain = require('../utils/remove-project');
const { print } = require('../utils/console-helper');

module.exports = async function () {
  if (!isLoggedIn()) {
    print();
    print(chalk.blue('Welcome !!'));
    await login();
  }

  const domain = '';

  try {
    await removeDomain(domain);
    print();
    print(chalk.green('Success: ') + 'project removed.');
    print();
  } catch (error) {
    print();
    print(chalk.red('Error: ') + 'failed to remove the project.');
    print();
    process.exit(0);
  }
};
