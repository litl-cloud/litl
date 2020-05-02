const chalk = require('chalk');
const urlToAddr = require('url-parse-as-address');
const { promptDomain } = require('./prompts');
const isDomain = require('is-domain');
const { print } = require('../utils/console-helper');

module.exports = {
  domainForm,
};

async function domainForm({ deployPath, domainSuggestion, ask }, isValid) {
  domainSuggestion = urlToAddr(domainSuggestion).host;

  print();
  print(chalk.green('path:'.padStart(15)) + ' ' + deployPath);
  if (!ask) {
    print(chalk.green('domain:'.padStart(15)) + ' ' + domainSuggestion);
    if (!isDomain(domainSuggestion)) {
      return Promise.reject({ error_code: 'invalid_domain' });
    }
    print();
    return Promise.resolve(domainSuggestion);
  }

  return new Promise(resolve => {
    promptDomain(domainSuggestion || '', isValid, domain => {
      resolve(domain);
    });
  });
}
