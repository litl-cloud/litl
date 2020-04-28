const fetch = require('node-fetch');
const logger = require('loglevel');
const config = require('../config');
const { getUserAgent, getPlatformInfo } = require('./client-info');

async function getBearerToken({ email, access_token, domain }) {
  const API_AUTH_PROJECT = `${config.HOST}${config.AUTH_PROJECT}`;

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
      access_token,
      domain,
    }),
  };

  try {
    const res = await fetch(API_AUTH_PROJECT, options);
    const response = await res.json();
    if (res.status !== 200 || response.error_code) {
      throw response;
    }
    return response.token;
  } catch (error) {
    logger.debug(error);
    throw error;
  }
}

module.exports = getBearerToken;
