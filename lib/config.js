const path = require('path');
const config = require('export-files')(path.join(__dirname, 'env'));

module.exports = config[process.env.STAGE || 'prod'];
