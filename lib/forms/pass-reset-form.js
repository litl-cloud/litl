const chalk = require('chalk');
const { promptForgot, promptEmail, promptPassword, promptVerificationCode } = require('./prompts');

module.exports = {
  passResetConfirmForm,
  passResetForm,
};

async function passResetConfirmForm() {
  return new Promise(resolve => {
    promptForgot(reply => {
      resolve({ reset: reply === 'yes' });
    });
  });
}

async function passResetForm(email) {
  if (!email) {
    return new Promise(resolve => {
      console.log();
      promptEmail('', email => {
        console.log();
        console.log('   sent a reset code to ' + chalk.bold(email));
        console.log();
        promptVerificationCode('', code => {
          resolve(code);
        });
      });
    });
  }

  return new Promise(resolve => {
    console.log();
    console.log('   sent a reset code to ' + chalk.bold(email));
    console.log();

    promptVerificationCode('', code => {
      promptPassword(password => {
        resolve({ email, password, code });
      });
    });
  });
}
