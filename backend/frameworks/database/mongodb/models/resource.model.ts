import { model, Schema } from 'mongoose';

import { IBaseSchema } from './base.model';

export interface IResourceSchema extends IBaseSchema {
  name: string;
  description: string;
}

const resourceSchema = new Schema<IResourceSchema>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

export const ResourceModel = model<IResourceSchema>('Resource', resourceSchema);
