import { IBaseRepo } from '@application/repositories/IBase.repo';
import { IBaseService } from '@application/services/IBase.service';
import { IBaseSchema } from '@frameworks/database/mongodb/models/base.model';

export abstract class BaseServices<Schema extends IBaseSchema>
  implements IBaseService<Schema>
{
  constructor(protected repo: IBaseRepo<Schema>) {}
  async create(Schema: Schema): Promise<Schema> {
    const response = await this.repo.create(Schema);
    return response;
  }
  async getAll(): Promise<Schema[]> {
    const response = await this.repo.getAll();
    return response;
  }
  async getById(id: string): Promise<Schema> {
    const response = await this.repo.getById(id);
    return response;
  }
  async update(id: string, Schema: Schema): Promise<Schema> {
    const response = await this.repo.update(id, Schema);
    return response;
  }
  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
