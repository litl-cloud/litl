const chalk = require('chalk');
const { promptVerificationCode } = require('./prompts');

module.exports = {
  emailVerificationForm,
};

async function emailVerificationForm(email) {
  console.log('   sent a verification code to ' + chalk.bold(email));
  console.log();
  return new Promise(resolve => {
    promptVerificationCode('', code => {
      resolve(code);
    });
  });
}
