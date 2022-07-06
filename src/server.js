// External Dependencies 
const http = require('http');

// Internal Dependencies 
const app = require('./app');

// Instances
const server = http.createServer(app);

module.exports = server;
