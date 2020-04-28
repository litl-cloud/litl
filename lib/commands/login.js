const chalk = require('chalk');
const verifyLogin = require('../utils/login');
const { loginForm } = require('../forms/login-form');
const { emailVerificationForm } = require('../forms/email-verif-form');
const { passResetConfirmForm, passResetForm } = require('../forms/pass-reset-form');
const { verifyAccount, sendPasswordResetCode, resetAccountPassword } = require('../utils/account');
const { getLogin, setLogin, isLoggedIn } = require('../utils/session-helper');
const logger = require('loglevel');

module.exports = async function (reset) {
  // if (reset) {
  //   clearLogin();
  //   const code = await passResetForm();
  //   console.log('code is ', code);
  //   return;
  // }

  console.log();
  console.log(lpad('login (or create account) by entering email & password'));
  console.log();
  const session = getLogin();

  if (isLoggedIn(session)) {
    console.log(lpad(`already logged in as ${chalk.bold(session.login)}`));
    console.log(lpad('if you wish to login as different user, logout and login again'));
    console.log('');
    return;
  }

  let attempts = 0;
  const response = await (async function tryLogin(email) {
    attempts++;
    const cred = await loginForm(email);
    let loginResult = await verifyLogin(cred.email, cred.password);

    if (loginResult.error_code) {
      if (loginResult.error_code === 'exception') {
        console.log(lpad(chalk.red('Error')) + ' - failed to login.');
        console.log();
        process.exit(1);
      }

      if (loginResult.error_code === 'unverified') {
        const code = await emailVerificationForm(cred.email);
        const verif_res = await verifyAccount(cred.email, code);

        if (!verif_res.error_code) {
          return verif_res;
        }
        console.log();
        console.log(lpad(chalk.yellow('Account Verification')) + ' - verification failed');
        console.log();
        process.exit(1);
      }

      if (attempts < 2) {
        console.log(lpad(chalk.red('invalid credentials, try again.')));
        console.log('');
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
    console.log(lpad(`${chalk.green('Success')} - Logged in as ${chalk.underline(response.email)}`));
    console.log('');
    return;
  }

  console.log(lpad(`${chalk.red('Failed')} - error`));
  console.log('');
};

function lpad(str) {
  return '   ' + str;
}
