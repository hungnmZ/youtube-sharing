import { IBaseRepo } from '@application/repositories/IBase.repo';
import { Model } from 'mongoose';

import { IBaseSchema } from '../models/base.model';

export abstract class BaseRepo<Schema extends IBaseSchema> implements IBaseRepo<Schema> {
  constructor(private model: Model<Schema>) {
    this.model = model;
  }

  async create(doc: Schema): Promise<Schema> {
    return this.model.create(doc);
  }

  async getAll(): Promise<Schema[]> {
    return this.model.find();
  }

  async getById(id: string): Promise<Schema> {
    return this.model.findById(id);
  }

  async update(id: string, doc: Schema): Promise<Schema> {
    return this.model.findByIdAndUpdate(id, { $set: doc }, { new: true });
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id });
  }
}
