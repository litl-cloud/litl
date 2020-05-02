const chalk = require('chalk');
const { promptForgot, promptEmail, promptPassword, promptVerificationCode } = require('./prompts');
const { print } = require('../utils/console-helper');

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
      print();
      promptEmail('', email => {
        print();
        print('sent a reset code to ' + chalk.bold(email));
        print();
        promptVerificationCode('', code => {
          resolve(code);
        });
      });
    });
  }

  return new Promise(resolve => {
    print();
    print('sent a reset code to ' + chalk.bold(email));
    print();

    promptVerificationCode('', code => {
      promptPassword(password => {
        resolve({ email, password, code });
      });
    });
  });
}
