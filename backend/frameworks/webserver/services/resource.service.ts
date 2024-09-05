import { IResourceRepo } from '@application/repositories/IResource.repo';
import { IResourceService } from '@application/services/IResource.serice';
import { IResourceSchema } from '@frameworks/database/mongodb/models/resource.model';

import { BaseServices } from './base.service';

export class ResourceService
  extends BaseServices<IResourceSchema>
  implements IResourceService
{
  constructor(protected repo: IResourceRepo) {
    super(repo);
  }
}
