const cli = require('commander');
const pkg = require('../package.json');
const litl = require('export-files')(`${__dirname}/commands`);
const config = require('./config');
const logger = require('loglevel');
const chalk = require('chalk');
logger.setLevel(config.LOG_LEVEL);

cli.version(pkg.version);
cli.usage(`

${chalk.bold('    One step deployment for front-end apps.')}

    navigate to project path and run the command
    litl`);

cli
  .arguments('[path]')
  .option('-s, --stage <name>', 'stage name of the deployment')
  .option('--prod', 'prod deployment (same as --stage=prod)')
  // .option('--secret', 'secret token to authorize deployment')
  .action(async (path, options) => {
    await litl.deploy({
      projPath: path || '.',
      stage: options.stage || 'dev',
      secret: options.secret || '',
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

cli.addHelpCommand(true);
cli.parse(process.argv);
