/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { IResourceSchema } from '../../frameworks/database/mongodb/models/resource.model';
import { BaseRepo } from '../../frameworks/database/mongodb/repositories/base.repo';
import { ResourceRepo } from '../../frameworks/database/mongodb/repositories/resource.repo';

jest.mock('../../frameworks/database/mongodb/repositories/base.repo');

describe('ResourceRepo', () => {
  let resourceRepo: ResourceRepo;
  let mockBaseRepo: Partial<BaseRepo<IResourceSchema>>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a mock object that matches the BaseRepo interface
    mockBaseRepo = {
      create: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Mock the BaseRepo constructor to return our mockBaseRepo
    (BaseRepo as jest.Mock).mockImplementation(
      () => mockBaseRepo as BaseRepo<IResourceSchema>,
    );

    resourceRepo = new ResourceRepo();
  });

  describe('create', () => {
    it('should create a new resource', async () => {
      const mockResource: Partial<IResourceSchema> = {
        name: 'Test Resource',
        description: 'Test Description',
      };
      (mockBaseRepo.create as jest.Mock).mockResolvedValue(
        mockResource as IResourceSchema,
      );

      const result = await resourceRepo.create(mockResource as IResourceSchema);

      expect(mockBaseRepo.create).toHaveBeenCalledWith(mockResource);
      expect(result).toEqual(mockResource);
    });
  });

  describe('getAll', () => {
    it('should return all resources', async () => {
      const mockResources: IResourceSchema[] = [
        { name: 'Resource 1', description: 'Description 1' } as IResourceSchema,
        { name: 'Resource 2', description: 'Description 2' } as IResourceSchema,
      ];
      (mockBaseRepo.getAll as jest.Mock).mockResolvedValue(mockResources);

      const result = await resourceRepo.getAll();

      expect(mockBaseRepo.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockResources);
    });
  });

  describe('getById', () => {
    it('should return a resource by id', async () => {
      const mockResource: IResourceSchema = {
        _id: '123',
        name: 'Test Resource',
        description: 'Test Description',
      } as IResourceSchema;
      (mockBaseRepo.getById as jest.Mock).mockResolvedValue(mockResource);

      const result = await resourceRepo.getById('123');

      expect(mockBaseRepo.getById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockResource);
    });
  });

  describe('update', () => {
    it('should update a resource', async () => {
      const mockResource: IResourceSchema = {
        _id: '123',
        name: 'Updated Resource',
        description: 'Updated Description',
      } as IResourceSchema;
      (mockBaseRepo.update as jest.Mock).mockResolvedValue(mockResource);

      const result = await resourceRepo.update('123', mockResource);

      expect(mockBaseRepo.update).toHaveBeenCalledWith('123', mockResource);
      expect(result).toEqual(mockResource);
    });
  });

  describe('delete', () => {
    it('should delete a resource', async () => {
      (mockBaseRepo.delete as jest.Mock).mockResolvedValue(undefined);

      await resourceRepo.delete('123');

      expect(mockBaseRepo.delete).toHaveBeenCalledWith('123');
    });
  });
});
