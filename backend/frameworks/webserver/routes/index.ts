import { Application } from 'express';

import { SocketService } from '../services/socket.service';

import { resourceRouter } from './resource.router';

export const configRoutes = (app: Application, socketService: SocketService) => {
  app.use('/api/v1/resource', resourceRouter(socketService));
};
