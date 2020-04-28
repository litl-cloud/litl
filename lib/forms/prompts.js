const read = require('read');
const chalk = require('chalk');
const isDomain = require('is-domain');

module.exports = {
  promptDomain,
  promptForgot,
  promptEmail,
  promptPassword,
  promptVerificationCode,
};

function promptDomain(suggestion, isValid, cb) {
  read(
    {
      prompt: chalk.green('domain:'.padStart(15)),
      silent: false,
      default: suggestion || '',
      edit: true,
    },
    function (err, answer) {
      if (answer === undefined) {
        console.log();
        return abort('not publishied.');
      }
      if (!isDomain(answer)) {
        return promptDomain(answer, isValid, cb);
      } else {
        console.log();
        return cb(answer);
      }
    },
  );
}

function promptEmail(suggestion, cb) {
  const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  read(
    {
      prompt: chalk.green('email:'.padStart(15)),
      silent: false,
      default: suggestion || '',
      edit: true,
    },
    function (err, answer) {
      if (answer === undefined) {
        console.log();
        return abort('not authenticated.');
      }
      if (!pattern.test(answer)) {
        return promptEmail(answer, cb);
      } else {
        return cb(answer);
      }
    },
  );
}

function promptPassword(cb) {
  // var out = req.config.output;
  s = 0;
  // if (out) out.isTTY = false;
  read(
    {
      prompt: chalk.green('password:'.padStart(15)),
      silent: true,
      // replace: '*',
    },
    function (err, answer) {
      if (answer === undefined) {
        console.log();
        return abort('not authenticated.');
      }
      if (!answer) {
        return promptPassword(cb);
      } else {
        console.log();
        return cb(answer);
      }
    },
  );
}

function promptVerificationCode(suggestion, cb) {
  read(
    {
      prompt: chalk.green('Verification Code:'.padStart(24)),
      silent: false,
      default: suggestion || '',
      edit: true,
    },
    function (err, answer) {
      if (answer === undefined) {
        console.log();
        return abort('not publishied.');
      }
      if (!answer) {
        return promptVerificationCode(answer, cb);
      } else {
        console.log();
        return cb(answer);
      }
    },
  );
}

function promptForgot(cb) {
  read(
    {
      prompt: chalk.red('forgot?'.padStart(15)),
      default: 'yes',
      edit: true,
    },
    function (err, answer) {
      if (answer === 'yes' || answer === 'y' || answer === 'Y') {
        cb();
      } else {
        abort('Invalid Login');
        process.exit(1);
      }
    },
  );
}

function abort(msg) {
  console.log('');
  console.log(chalk.yellow('   Aborted - ') + msg);
  console.log('');
}
