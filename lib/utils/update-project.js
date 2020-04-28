const fetch = require('node-fetch');
const config = require('../config');
const { getUserAgent } = require('./client-info');

module.exports = async function updateProject({ bearerToken }) {
  const API_UPDATE_PROJECT = `${config.HOST}${config.UPDATE_PROJECT}`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      authorization: `Bearer ${bearerToken}`,
      'user-agent': getUserAgent(),
    },
    body: JSON.stringify({}),
  };

  try {
    const res = await fetch(API_UPDATE_PROJECT, options);
    const response = await res.json();
    // if (res.status !== 200) {
    //   // http status is 4xx or 5xx
    // }
    return response;
  } catch (error) {
    return {
      status: 'error',
      status_code: 'exception',
    };
  }
};
