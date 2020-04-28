const Table = require('cli-table3');
const chalk = require('chalk');
const getUserProjects = require('../utils/list-projects');
const { isLoggedIn, clearLogin } = require('../utils/session-helper');
const login = require('./login');

module.exports = async function () {
  if (!isLoggedIn()) {
    console.log();
    console.log(chalk.blue('   Welcome !!'));
    await login();
  }

  try {
    var data = addColors(await getUserProjects());
  } catch (error) {
    if (error === 'unauthorized') {
      console.log();
      console.log(chalk.red('   Error: ') + 'session expired.');
      console.log();
      clearLogin();
      process.exit(0);
    }
    console.log();
    console.log(chalk.red('   Error: ') + 'failed to list projects.');
    console.log();
    process.exit(0);
  }

  var table = new Table({
    head: data.head,
    chars: {
      top: '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      bottom: '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      left: '  ',
      'left-mid': '',
      mid: '',
      'mid-mid': '',
      right: '',
      'right-mid': '',
      middle: '   ',
    },
    style: { 'padding-left': 1, 'padding-right': 1 },
  });

  console.log();
  if (!data.body || !data.body.length) {
    console.log("   You haven't published any projects. Start publishing your first project.");
  } else {
    table.push(...data.body);
    console.log(table.toString());
  }
  console.log();
};

function addColors(data) {
  return {
    head: (data.head || []).map(label => chalk.bold.yellow(label)),
    body: data.body || [],
  };
}
