export interface IBaseRepo<T> {
  create(entity: T): Promise<T>;
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
