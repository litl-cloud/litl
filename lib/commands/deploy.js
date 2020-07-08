const chalk = require('chalk');
const uploadProject = require('../utils/upload-project');
const updateProject = require('../utils/update-project');
const { isLoggedIn, getLogin } = require('../utils/session-helper');
const login = require('./login');
const { domainForm } = require('../forms/domain-form');
const checkAuth = require('../utils/auth-helper');
const logger = require('loglevel');
const { getDomainSuggestion } = require('../utils/domain-helper');
const mustache = require('mustache');
const { print } = require('../utils/console-helper');
const { getLitlJson, updateLitlJson } = require('../utils/lite-json-helper');
const path = require('path');

async function deploy({ projPath, stage, _secret }) {
  try {
    if (!validatePath(projPath)) {
      print();
      print(chalk.red('Error: ') + 'invalid project path ' + projPath);
      print();
      process.exit(1);
    }

    if (!isLoggedIn()) {
      print();
      print(chalk.blue('Welcome !!'));
      await login();
    }

    const litlJson = getLitlJson(projPath);
    const deployPath = path.join(projPath, litlJson.distDir);

    stage = stage || 'dev';
    const domainSuggestion = await getDomainSuggestion(litlJson.projectId, stage);

    if (!litlJson.projectId) {
      stage = 'prod';
    }

    // get domain name suggestion
    const domain = await domainForm(
      { deployPath, domainSuggestion: domainSuggestion.domain, stage, ask: domainSuggestion.isNew },
      name => {
        return false;
      },
    );

    // TODO: add a loader in console here

    const session = getLogin();
    const authResult = await checkAuth({
      email: session.login,
      access_token: session.password,
      projectId: litlJson.projectId,
      domain,
      stage,
    });

    await uploadProject({ deployPath, bearerToken: authResult.token });
    const updateResult = await updateProject({ bearerToken: authResult.token });
    logger.debug(updateResult);
    console.log(updateResult);

    updateLitlJson(deployPath, {
      projectId: updateResult.projectId,
      distDir: '.',
    });

    print();
    print(chalk.green('Success !!'));
    print();
  } catch (error) {
    // print();
    logger.debug(error);
    // const view = { domain: chalk.bold(domain) };
    print(chalk.red('Error: ') + getErrorMessage(error));
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
