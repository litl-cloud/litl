const fetch = require('node-fetch');
const config = require('../config');
const { getUserAgent, getPlatformInfo } = require('./client-info');
const logger = require('loglevel');

module.exports = {
  verifyAccount,
  resetAccountPassword,
  sendPasswordResetCode,
};

async function verifyAccount(email, code) {
  const API_VERIFY_ACCOUNT = `${config.HOST}${config.VERIFY_ACCOUNT}`;

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
      code,
    }),
  };

  try {
    const res = await fetch(API_VERIFY_ACCOUNT, options);
    const response = await res.json();
    // if (res.status !== 200) {
    //   // http status is 4xx or 5xx
    // }
    return response;
  } catch (error) {
    logger.error(error);
    return {
      status: 'error',
      status_code: 'exception',
    };
  }
}

async function resetAccountPassword(email, password, code) {
  const API_RESET_PASS = `${config.HOST}${config.RESET_PASS}`;

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
      code,
    }),
  };

  try {
    const res = await fetch(API_RESET_PASS, options);
    const response = await res.json();
    // if (res.status !== 200) {
    //   // http status is 4xx or 5xx
    // }
    return response;
  } catch (error) {
    logger.error(error);
    return {
      status: 'error',
      status_code: 'exception',
    };
  }
}

async function sendPasswordResetCode(email) {
  const API_RESET_CODE = `${config.HOST}${config.RESET_CODE}`;

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
    }),
  };

  try {
    const res = await fetch(API_RESET_CODE, options);
    const response = await res.json();
    // if (res.status !== 200) {
    //   // http status is 4xx or 5xx
    // }
    return response;
  } catch (error) {
    logger.error(error);
    return {
      status: 'error',
      status_code: 'exception',
    };
  }
}
