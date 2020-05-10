const moniker = require('moniker');
const path = require('path');
const fs = require('fs');

module.exports = {
  getDomainSuggestion,
  getDomainFromLitlJson,
};

function getDomainSuggestion() {
  const subDomain = moniker.choose().split(' ').join('-');
  return [subDomain, 'litl.sh'].join('.');
}

function getDomainFromLitlJson(projPath) {
  try {
    const json = JSON.parse(fs.readFileSync(path.join(projPath, 'litl.json')).toString());
    return typeof json.alias === 'string' ? json.alias : '';
  } catch (e) {}
}
