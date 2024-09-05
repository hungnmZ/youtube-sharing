import { configRoutes } from '@frameworks/webserver/routes';
import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { ENV_CONFIG } from './env.config';

export const expressConfig = (app: Application) => {
  app.use(morgan('dev'));
  app.use(compression());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const whiteList = [''];
  app.use(
    cors({
      origin: whiteList,
      credentials: true,
    }),
  );

  configRoutes(app);

  app.listen(ENV_CONFIG.PORT, () => {
    console.log(`Server is running on port ${ENV_CONFIG.PORT}`);
  });
};
