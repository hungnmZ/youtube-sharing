import { ResourceRepo } from '@frameworks/database/mongodb/repositories/resource.repo';
import { ResourceController } from '@frameworks/webserver/controllers/resource.controller';
import { Router } from 'express';

import { asyncHandler } from '../middlewares/async.middleware';
import { ResourceService } from '../services/resource.service';

export const resourceRouter = (): Router => {
  const router = Router();
  const resourceRepo = new ResourceRepo();
  const resourceService = new ResourceService(resourceRepo);
  const controller = new ResourceController(resourceService);

  router
    .route('/')
    .post(asyncHandler(controller.create))
    .get(asyncHandler(controller.getAll));

  router
    .route('/:id')
    .get(asyncHandler(controller.getById))
    .put(asyncHandler(controller.update))
    .delete(asyncHandler(controller.delete));

  return router;
};
