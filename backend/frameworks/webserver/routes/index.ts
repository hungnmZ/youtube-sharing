import { Application } from 'express';

import { resourceRouter } from './resource.router';

export const configRoutes = (app: Application) => {
  app.use('/api/v1/resource', resourceRouter());
};
