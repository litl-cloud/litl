const chalk = require('chalk');
const uploadProject = require('../utils/upload-project');
const updateProject = require('../utils/update-project');
const { isLoggedIn, getLogin } = require('../utils/session-helper');
const login = require('./login');
const { domainForm } = require('../forms/domain-form');
const getBearerToken = require('../utils/token-helper');
const logger = require('loglevel');
const { getDomainSuggestion, getDomainFromLitlJson } = require('../utils/domain-helper');
const mustache = require('mustache');
const { print } = require('../utils/console-helper');

async function deploy(deployPath, { domain }) {
  try {
    if (!validatePath(deployPath)) {
      print();
      print(chalk.red('Error: ') + 'invalid project path ' + deployPath);
      print();
      process.exit(1);
    }

    if (!isLoggedIn()) {
      print();
      print(chalk.blue('Welcome !!'));
      await login();
    }

    const domainSuggestion = getDomainSuggestion();
    domain = domain || getDomainFromLitlJson(deployPath);
    domain = await domainForm({ deployPath, domainSuggestion: domain || domainSuggestion, ask: !domain }, name => {
      return false;
    });

    const session = getLogin();
    const bearerToken = await getBearerToken({ email: session.login, access_token: session.password, domain });
    await uploadProject({ deployPath, bearerToken });
    await updateProject({ bearerToken });

    print();
    print(chalk.green('Success !!'));
    print();
  } catch (error) {
    // print();
    logger.debug(error);
    const view = { domain: chalk.bold(domain) };
    print(chalk.red('Error: ') + getErrorMessage(error, view));
    print();
  }
}

function validatePath(deployPath) {
  return true;
}

function getErrorMessage(error, view) {
  const errorType = error && typeof error === 'object' ? error.error_code : '';
  const message = error && typeof error === 'object' ? error.message : '';
  if (errorType === 'no_publish_access') {
    return mustache.render(message, view || {});
  }
  if (message) {
    return message;
  }

  switch (errorType) {
    case 'too_many_files':
      return "Hmm, that's too many files. atmost 1000 files are allowed.";
    default:
      return 'failed to publish because of an unknown error. try again.';
  }
}

module.exports = deploy;
