import dotenv from 'dotenv';
dotenv.config();

import { expressConfig } from '@config/express.config';
import { initMongoDB } from '@frameworks/database/mongodb/connection';
import {
  is404Handler,
  returnError,
} from '@frameworks/webserver/middlewares/errorHandler.middleware';
import express from 'express';

// Connect database
initMongoDB();

const app = express();

// express.js configuration (middlewares,...)
expressConfig(app);

// Handle error middleware
app.use(is404Handler);
app.use(returnError);
