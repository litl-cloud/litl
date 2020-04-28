const moniker = require('moniker');
const path = require('path');
const fs = require('fs');
const os = require('os');

module.exports = {
  getDomainSuggestion,
  getDomainFromCname,
};

function getDomainSuggestion() {
  // const subDomain = faker.fake('{{hacker.adjective}}-{{hacker.noun}}').split(' ').join('-');
  const subDomain = moniker.choose().split(' ').join('-');
  return [subDomain, 'lite.sh'].join('.');
}

function getDomainFromCname(projPath) {
  try {
    const cname = fs.readFileSync(path.join(projPath, 'CNAME')).toString();
    return cname.split(os.EOL)[0].trim();
  } catch (e) {}
}
