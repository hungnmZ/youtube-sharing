import dotenv from 'dotenv';
dotenv.config();

import { ENV_CONFIG } from '@config/env.config';
import { expressConfig } from '@config/express.config';
import { initMongoDB } from '@frameworks/database/mongodb/connection';
import {
  handle404Error,
  handleError,
} from '@frameworks/webserver/middlewares/errorHandler.middleware';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

// Connect database
initMongoDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ENV_CONFIG.ORIGIN,
    credentials: true,
  },
  path: '/socket.io/',
});

// express.js configuration
expressConfig(app, io);

// Handle error middleware
app.use(handle404Error);
app.use(handleError);

// Start the server
const PORT = ENV_CONFIG.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
