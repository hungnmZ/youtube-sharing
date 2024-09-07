import { ResourceRepo } from '@frameworks/database/mongodb/repositories/resource.repo';
import { ResourceController } from '@frameworks/webserver/controllers/resource.controller';
import { Router } from 'express';

import { asyncAuthHandler } from '../middlewares/auth.middleware';
import { ResourceService } from '../services/resource.service';
import { SocketService } from '../services/socket.service';

export const resourceRouter = (socketService: SocketService): Router => {
  const router = Router();
  const resourceRepo = new ResourceRepo();
  const resourceService = new ResourceService(resourceRepo);
  const controller = new ResourceController(resourceService, socketService);

  router.route('/share').post(asyncAuthHandler(controller.share));

  return router;
};
