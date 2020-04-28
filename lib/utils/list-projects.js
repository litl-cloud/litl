const fetch = require('node-fetch');
const logger = require('loglevel');
const config = require('../config');
const { getUserAgent, getPlatformInfo } = require('./client-info');
const { getLogin } = require('./session-helper');

module.exports = async function getUserProjects() {
  const API_GET_PROJECTS = `${config.HOST}${config.GET_PROJECTS}`;
  const session = getLogin();

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'user-agent': getUserAgent(),
      'user-platform': getPlatformInfo(),
    },
    body: JSON.stringify({
      email: session.login,
      access_token: session.password,
    }),
  };

  try {
    const res = await fetch(API_GET_PROJECTS, options);
    if (res.status === 200) {
      const response = await res.json();
      return response;
    } else if (res.status === 401) {
      throw 'unauthorized';
    } else {
      throw 'server_error';
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
