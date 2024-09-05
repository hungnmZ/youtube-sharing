import { IResourceService } from '@application/services/IResource.serice';
import { IResourceSchema } from '@frameworks/database/mongodb/models/resource.model';
import { CREATED, OK } from '@frameworks/webserver/utils/response/success.response';
import { validate } from 'class-validator';
import { Request, Response } from 'express';

import { CreateResourceDTO } from '../dtos/resource/createResource.dto';
import { UpdateResourceDTO } from '../dtos/resource/updateResource.dto';
import { Api400Error } from '../utils/response/error.response';

export class ResourceController {
  constructor(private resourceService: IResourceService) {
    this.resourceService = resourceService;
  }

  create = async (req: Request, res: Response) => {
    const resourceDTO = new CreateResourceDTO(req.body as CreateResourceDTO);
    const validation = await validate(resourceDTO);

    if (validation.length > 0) {
      throw new Api400Error('Invalid data', validation);
    }

    const resource: IResourceSchema = { ...resourceDTO };
    CREATED({ res, data: await this.resourceService.create(resource) });
  };

  getAll = async (req: Request, res: Response) => {
    OK({ res, data: await this.resourceService.getAll() });
  };

  getById = async (req: Request, res: Response) => {
    OK({ res, data: await this.resourceService.getById(req.params.id) });
  };

  update = async (req: Request, res: Response) => {
    const resourceDTO = new UpdateResourceDTO(req.body as UpdateResourceDTO);
    const validation = await validate(resourceDTO);

    if (validation.length > 0) {
      throw new Api400Error('Invalid data', validation);
    }
    const resource: IResourceSchema = { ...resourceDTO };
    OK({ res, data: await this.resourceService.update(req.params.id, resource) });
  };

  delete = async (req: Request, res: Response) => {
    await this.resourceService.delete(req.params.id);

    OK({ res });
  };
}
