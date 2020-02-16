const http = require('http'); //import http package from node_modules
const app = require('./app.js') //app.js with express qualifies as a 'request handler'

const port = process.env.port || 3000; //get port from environment var if available otherwise 3000

const server = http.createServer(app); //need to pass a 'listener' to createServer

server.listen(port); //listen on port