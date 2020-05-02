const moniker = require('moniker');
const path = require('path');
const fs = require('fs');

module.exports = {
  getDomainSuggestion,
  getDomainFromLiteJson,
};

function getDomainSuggestion() {
  const subDomain = moniker.choose().split(' ').join('-');
  return [subDomain, 'lite.sh'].join('.');
}

function getDomainFromLiteJson(projPath) {
  try {
    const json = JSON.parse(fs.readFileSync(path.join(projPath, 'lite.json')).toString());
    return typeof json.alias === 'string' ? json.alias : '';
  } catch (e) {}
}
