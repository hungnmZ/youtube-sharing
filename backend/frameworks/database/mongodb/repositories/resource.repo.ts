import { IResourceRepo } from '@application/repositories/IResource.repo';

import { IResourceSchema, ResourceModel } from '../models/resource.model';

import { BaseRepo } from './base.repo';

export class ResourceRepo extends BaseRepo<IResourceSchema> implements IResourceRepo {
  constructor() {
    super(ResourceModel);
  }
}
