const serverless = require('serverless-http');
const app = require('../backend/server-simple');

module.exports = serverless(app);
