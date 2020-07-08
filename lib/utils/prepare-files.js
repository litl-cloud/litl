const path = require('path');
const readdir = require('recursive-readdir');
const ignore = require('ignore');
const fs = require('fs');
const chalk = require('chalk');
const loglevel = require('loglevel');

const errorStr = chalk.bold.red;

async function prepareFiles(deployPath) {
  // check if given path is a directory
  const stats = fs.statSync(deployPath);
  if (!stats.isDirectory()) {
    throw errorStr('given path is not a directory!');
  }

  // convert relative paths to absolute paths
  if (!path.isAbsolute(deployPath)) {
    loglevel.debug('converting relative path absolute');
    deployPath = path.resolve(deployPath);
  }

  const pathContents = await readdir(deployPath, [ignoreFile()]);
  loglevel.debug('pathContents', pathContents);

  const deployList = ignore()
    .add(getIgnores(deployPath))
    .filter(pathContents.map(filePath => path.relative(deployPath, filePath)))
    .map(relativePath => ({
      path: path.join(deployPath, relativePath),
      key: relativePath,
    }));

  loglevel.debug('deployList lenght', deployList.length);

  return deployList;
}

function getIgnores(deployPath) {
  let userList = '';
  try {
    userList = fs.readFileSync(path.join(deployPath, '.litlignore'));
  } catch (error) {
    loglevel.debug('no ignore file found in the path');
  }

  const ignoreList = `${getIgnoreList().join('\n')}\n${userList}`;
  loglevel.debug('total ignore list', ignoreList);
  return ignoreList;
}

function ignoreFile() {
  const ignoreList = getIgnoreList();

  return function (file, stats) {
    return ignoreList.includes(path.basename(file));
  };
}

function getIgnoreList() {
  return [
    ...['.hg', '.git', '.gitmodules', '.svn'],
    ...['node_modules', 'bower_components', 'typings'],
    ...['.gitignore', '.npmignore', '.yarnignore', '.dockerignore'],
    ...['.vscode', '.idea', '.project', '.classpath', '.settings', '.history', '*.sublime-workspace'],
    ...['package.json', 'package-lock.json', 'yarn.lock', 'npm-debug.log', 'yarn-error.log'],
    ...['.env', '.env.*', '.DS_Store', 'Thumbs.db', '.cache'],
    ...['.litlignore', 'CNAME'],
  ];
}

module.exports = prepareFiles;
