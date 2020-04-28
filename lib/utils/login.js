const fetch = require('node-fetch');
const logger = require('loglevel');
const config = require('../config');
const { getUserAgent, getPlatformInfo } = require('./client-info');

async function verifyLogin(email, password) {
  const API_LOGIN = `${config.HOST}${config.LOGIN}`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'user-agent': getUserAgent(),
      'user-platform': getPlatformInfo(),
    },
    body: JSON.stringify({
      email,
      password,
    }),
  };

  try {
    const res = await fetch(API_LOGIN, options);
    const response = await res.json();
    // if (res.status !== 200) {
    //   // http status is 4xx or 5xx
    // }
    return response;
  } catch (error) {
    logger.error(error);
    return {
      status: 'error',
      error_code: 'exception',
    };
  }
}

module.exports = verifyLogin;
