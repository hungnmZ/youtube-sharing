import { IResourceSchema } from '@frameworks/database/mongodb/models/resource.model';

import { IBaseRepo } from './IBase.repo';

export interface IResourceRepo extends IBaseRepo<IResourceSchema> {}
