const chalk = require('chalk');
const { promptVerificationCode } = require('./prompts');
const { print } = require('../utils/console-helper');

module.exports = {
  emailVerificationForm,
};

async function emailVerificationForm(email) {
  print('sent a verification code to ' + chalk.bold(email));
  print();
  return new Promise(resolve => {
    promptVerificationCode('', code => {
      resolve(code);
    });
  });
}
