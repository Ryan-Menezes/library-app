
// Internal Dependencies 
const server = require('./server');
const { server: serverConfig } = require('./config');

server.listen(serverConfig.port, serverConfig.host);
