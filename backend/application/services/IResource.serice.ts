import { IResourceSchema } from '@frameworks/database/mongodb/models/resource.model';

import { IBaseService } from './IBase.service';

export interface IResourceService extends IBaseService<IResourceSchema> {}
