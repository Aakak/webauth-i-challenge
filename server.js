const express = require('express');

const apiRouter = require('./api/api-router.js');
const authMiddleware = require('./api/auth-middleware.js');

const server = express();
authMiddleware(server);

server.use('/api', apiRouter);

module.exports = server;

