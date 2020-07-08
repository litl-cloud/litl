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

  return await uploadObject(file.path, file.key, bearerToken).then(() => {
    updateProgress();
    return uploadNext({ objFactory, bearerToken }, updateProgress);
  });
}

async function uploadObject(objectPath, objectKey, bearerToken) {
  try {
    const apiUrl = config.UPLOAD_API;

    await uploadToRegion('us');
    await uploadToRegion('ap');

    async function uploadToRegion(region) {
      const stream = fs.createReadStream(objectPath);
      const stats = fs.statSync(objectPath);

      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': mime.getType(objectPath) || 'application/octet-stream',
          'Content-Length': stats.size,
          'file-path': objectKey,
          authorization: `Bearer ${bearerToken}`,
          region,
        },
        body: stream,
      };
      const response = await fetch(apiUrl, options);
      if (response.status !== 200) {
        logger.error('upload returned error status', response.status);
        throw 'error uploading ' + objectPath;
      }
    }
  } catch (error) {
    logger.error('error uploading object', error);
    throw error;
  }
}
