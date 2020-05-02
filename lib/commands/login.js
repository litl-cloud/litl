const chalk = require('chalk');
const verifyLogin = require('../utils/login');
const { loginForm } = require('../forms/login-form');
const { emailVerificationForm } = require('../forms/email-verif-form');
const { passResetConfirmForm, passResetForm } = require('../forms/pass-reset-form');
const { verifyAccount, sendPasswordResetCode, resetAccountPassword } = require('../utils/account');
const { getLogin, setLogin, isLoggedIn } = require('../utils/session-helper');
const logger = require('loglevel');
const { print } = require('../utils/console-helper');

module.exports = async function (reset) {
  // if (reset) {
  //   clearLogin();
  //   const code = await passResetForm();
  //   print('code is ', code);
  //   return;
  // }

  const session = getLogin();

  if (isLoggedIn(session)) {
    print(`already logged in as ${chalk.bold(session.login)}`);
    print('if you wish to login as different user, logout and login again');
    print();
    return;
  }

  print();
  print('login (or create account) by entering email & password');
  print();

  let attempts = 0;
  const response = await (async function tryLogin(email) {
    attempts++;
    const cred = await loginForm(email);
    let loginResult = await verifyLogin(cred.email, cred.password);

    if (loginResult.error_code) {
      if (loginResult.error_code === 'exception') {
        print(chalk.red('Error') + ' - failed to login.');
        print();
        process.exit(1);
      }

      if (loginResult.error_code === 'unverified') {
        const code = await emailVerificationForm(cred.email);
        const verif_res = await verifyAccount(cred.email, code);

        if (!verif_res.error_code) {
          return verif_res;
        }
        print();
        print(chalk.yellow('Account Verification') + ' - verification failed');
        print();
        process.exit(1);
      }

      if (attempts < 2) {
        print(chalk.red('invalid credentials, try again.'));
        print();
        return await tryLogin(cred.email);
      } else {
        const reset = await passResetConfirmForm();
        if (reset) {
          await sendPasswordResetCode(cred.email);
          const resetRes = await passResetForm(cred.email);
          logger.debug({ resetRes });
          loginResult = await resetAccountPassword(resetRes.email, resetRes.password, resetRes.code);
        }
      }
    }
    return { email, ...loginResult };
  })();

  logger.debug({ response });
  if (!response.error_code && response.email && response.token) {
    setLogin(response.email, response.token);
    print(`${chalk.green('Success')} - Logged in as ${chalk.underline(response.email)}`);
    print();
    return;
  }

  print(`${chalk.red('Failed')} - error`);
  print();
};
