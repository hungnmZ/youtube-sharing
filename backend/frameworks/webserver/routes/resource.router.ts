import { ResourceRepo } from '@frameworks/database/mongodb/repositories/resource.repo';
import { ResourceController } from '@frameworks/webserver/controllers/resource.controller';
import { Router } from 'express';

import { asyncAuthHandler } from '../middlewares/auth.middleware';
import { ResourceService } from '../services/resource.service';

export const resourceRouter = (): Router => {
  const router = Router();
  const resourceRepo = new ResourceRepo();
  const resourceService = new ResourceService(resourceRepo);
  const controller = new ResourceController(resourceService);

  router
    .route('/')
    .get(asyncAuthHandler(controller.getAll))
    .post(asyncAuthHandler(controller.create));

  router
    .route('/:id')
    .get(asyncAuthHandler(controller.getById))
    .put(asyncAuthHandler(controller.update))
    .delete(asyncAuthHandler(controller.delete));

  return router;
};
