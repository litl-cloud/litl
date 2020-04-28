const chalk = require('chalk');
const urlToAddr = require('url-parse-as-address');
const { promptDomain } = require('./prompts');
const isDomain = require('is-domain');

module.exports = {
  domainForm,
};

async function domainForm({ deployPath, domainSuggestion, ask }, isValid) {
  domainSuggestion = urlToAddr(domainSuggestion).host;

  console.log();
  console.log(chalk.green('path:'.padStart(15)) + ' ' + deployPath);
  if (!ask) {
    console.log(chalk.green('domain:'.padStart(15)) + ' ' + domainSuggestion);
    if (!isDomain(domainSuggestion)) {
      return Promise.reject({ error_code: 'invalid_domain' });
    }
    console.log();
    return Promise.resolve(domainSuggestion);
  }

  return new Promise(resolve => {
    promptDomain(domainSuggestion || '', isValid, domain => {
      resolve(domain);
    });
  });
}
