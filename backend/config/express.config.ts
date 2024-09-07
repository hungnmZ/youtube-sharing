import { configRoutes } from '@frameworks/webserver/routes';
import { SocketService } from '@frameworks/webserver/services/socket.service';
import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server } from 'socket.io';

import { ENV_CONFIG } from './env.config';

export const expressConfig = (app: Application, io: Server) => {
  app.use(morgan('dev'));
  app.use(compression());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const whiteList = ENV_CONFIG.ORIGIN;
  app.use(
    cors({
      origin: whiteList,
      credentials: true,
    }),
  );

  const socketService = new SocketService(io);
  configRoutes(app, socketService);
};
