const netrc = require('netrc');
const config = require('../config');

module.exports = {
  isLoggedIn,
  getLogin,
  setLogin,
  clearLogin,
};

function isLoggedIn(session) {
  session = session || getLogin();
  return !!(session && session.login);
}

function getLogin() {
  const host = config.CRED_HOST;
  const netrcObj = netrc();
  return netrcObj[host];
}

function setLogin(email, token) {
  const host = config.CRED_HOST;
  const netrcObj = netrc();
  netrcObj[host] = {
    login: email,
    password: token,
  };

  netrc.save(netrcObj);
}

function clearLogin() {
  const host = config.CRED_HOST;
  const netrcObj = netrc();

  if (netrcObj[host]) {
    delete netrcObj[host];
    netrc.save(netrcObj);
  }
}
