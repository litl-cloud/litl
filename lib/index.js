const cli = require('commander');
const pkg = require('../package.json');
const litl = require('export-files')(`${__dirname}/commands`);
const config = require('./config');
const logger = require('loglevel');
const chalk = require('chalk');
logger.setLevel(config.LOG_LEVEL);

cli.version(pkg.version);
cli.usage(`<path> [options]

${chalk.bold('  Commandline to publish frontend apps.')}

  ex: litl .
`);

cli
  .arguments('<path>')
  // .description('deploy the app')
  .option('-d, --domain <name>', 'domain of the app')
  // .option('-s, --spa, --client-routing', 'set to enable client side routing for single page apps')
  // .option('-t, --deployment-token', 'token to authorize deployment')
  .action(async (path, options) => {
    await litl.deploy(path, {
      domain: options.domain || '',
      token: options.deploymentToken || '',
      spa: options.spa,
    });
  });

cli
  .command('login')
  .description('login into your account or creates a new one')
  .option('--reset', 'reset account password')
  .action(options => {
    litl.login(options.reset);
  });

cli
  .command('logout')
  .description('log out of your account')
  .action(options => {
    litl.logout();
  });
cli
  .command('whoami')
  .description('show current logged in user')
  .action(options => {
    litl.whoami();
  });

cli
  .command('list')
  .description('list deployed apps')
  .action(options => {
    litl.list();
  });

// cli
//   .command('plan')
//   .description('manage account plan')
//   .action(options => {
//     console.log('---');
//   });

cli.addHelpCommand(true);

cli.parse(process.argv);
