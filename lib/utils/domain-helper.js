const moniker = require('moniker');
const fetch = require('node-fetch');
const config = require('../config');

module.exports = {
  getDomainSuggestion,
};

async function getDomainSuggestion(projectId, stage) {
  const apiUrl = `${config.HOST}${config.GET_PROJECT_DOMAIN}`;

  const options = {
    method: 'POST',
    body: JSON.stringify({
      projectId,
      stage,
    }),
  };

  try {
    const res = await fetch(apiUrl, options);
    const response = await res.json();
    if (response.domain) {
      return {
        domain: response.domain,
        isNew: response.isNew,
      };
    }
    const subDomain = moniker.choose().split(' ').join('-');
    return {
      domain: [subDomain, 'litl.io'].join('.'),
      isNew: true,
    };
  } catch (error) {
    return {
      domain: '',
      isNew: true,
    };
  }
}
