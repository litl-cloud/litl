const logger = require('loglevel');
const prepareFiles = require('./prepare-files');
const fetch = require('node-fetch');
const fs = require('fs');
const ProgressBar = require('progress');
const chalk = require('chalk');
const uploadFactory = require('./upload-factory');
const config = require('../config');
const { getUserAgent } = require('./client-info');
const mime = require('mime');
// const crypto = require('crypto');

module.exports = async function uploadProject({ deployPath, bearerToken }) {
  try {
    const deployList = await prepareFiles(deployPath);
    if (deployList.length > 1000) {
      throw { error_code: 'too_many_files' };
    }
    await upload({ deployList, bearerToken });
    logger.info('upload complete');
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

async function upload({ deployList, bearerToken }) {
  try {
    const updateProgress = progress(deployList.length);
    const objFactory = uploadFactory(deployList);
    // n tasks at a time
    await Promise.all(Array.from({ length: 10 }).map(() => uploadNext({ objFactory, bearerToken }, updateProgress)));
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

function progress(total) {
  const barConfig = '   uploading [:bar] :current/:total    :percent';
  const bar = new ProgressBar(barConfig, {
    complete: chalk.green('='),
    incomplete: ' ',
    width: 50,
    total: total,
  });
  bar.render();

  return () => {
    bar.tick();
  };
}

async function uploadNext({ objFactory, bearerToken }, updateProgress) {
  const file = objFactory.next();
  if (!file) return Promise.resolve();

  const signedUrl = await getSignedUrl({ objectKey: file.key, objectPath: file.path, bearerToken });
  if (!signedUrl) {
    logger.error('failed to get signedUrl');
    return Promise.reject();
  }

  return await uploadObject(file.path, signedUrl).then(() => {
    updateProgress();
    return uploadNext({ objFactory, bearerToken }, updateProgress);
  });
}

async function getSignedUrl({ objectKey, objectPath, bearerToken }) {
  logger.debug('getSignedUrl called with', { objectKey, objectPath, bearerToken });
  try {
    const API_UPLOAD_PROJECT = `${config.HOST}${config.UPLOAD_PROJECT}`;
    logger.debug('signed url api: ', API_UPLOAD_PROJECT);

    const options = {
      method: 'POST',
      headers: {
        'x-object': objectKey,
        'x-object-content-type': mime.getType(objectPath),
        accept: 'application/json',
        authorization: `Bearer ${bearerToken}`,
        'user-agent': getUserAgent(),
      },
      body: '',
    };

    const res = await fetch(API_UPLOAD_PROJECT, options);
    const response = await res.json();
    const signedUrl = response.signedUrl;
    logger.debug('signed url response', response);
    return signedUrl || '';
  } catch (error) {
    logger.debug('ERROR fetching signed URL', error);
    return '';
  }
}

async function uploadObject(objectPath, signedUrl) {
  try {
    const stream = fs.createReadStream(objectPath);
    const stats = fs.statSync(objectPath);
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': mime.getType(objectPath),
        'Content-Length': stats.size,
        // TODO: calculate MD5
        // 'Content-MD5': fileMD5,
      },
      body: stream,
    };
    const response = await fetch(signedUrl, options);
    if (response.status !== 200) {
      logger.error('signedUrl upload returned status', response.status);
      throw 'error uploading ' + objectPath;
    }
  } catch (error) {
    logger.error('error uploading object', error);
    throw error;
  }
}
