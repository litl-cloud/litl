const Table = require('cli-table3');
const chalk = require('chalk');
const getUserProjects = require('../utils/list-projects');
const { isLoggedIn, clearLogin } = require('../utils/session-helper');
const login = require('./login');
const { print } = require('../utils/console-helper');

module.exports = async function () {
  if (!isLoggedIn()) {
    print();
    print(chalk.blue('Welcome !!'));
    await login();
  }

  try {
    var data = addColors(await getUserProjects());
  } catch (error) {
    if (error === 'unauthorized') {
      print();
      print(chalk.red('Error: ') + 'session expired.');
      print();
      clearLogin();
      process.exit(0);
    }
    print();
    print(chalk.red('Error: ') + 'failed to list projects.');
    print();
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

  print();
  if (!data.body || !data.body.length) {
    print("You haven't published any projects. Start publishing your first project.");
  } else {
    table.push(...data.body);
    print(table.toString(), false);
  }
  print();
};

function addColors(data) {
  return {
    head: (data.head || []).map(label => chalk.bold.yellow(label)),
    body: data.body || [],
  };
}
