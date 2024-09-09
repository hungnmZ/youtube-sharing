/* eslint-disable @typescript-eslint/unbound-method */

import { IResourceSchema } from '../../frameworks/database/mongodb/models/resource.model';
import { BaseRepo } from '../../frameworks/database/mongodb/repositories/base.repo';
import { ResourceRepo } from '../../frameworks/database/mongodb/repositories/resource.repo';

jest.mock('../../frameworks/database/mongodb/repositories/base.repo');

describe('ResourceRepo', () => {
  let resourceRepo: ResourceRepo;
  let mockBaseRepo: jest.Mocked<BaseRepo<IResourceSchema>>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockBaseRepo = {
      create: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      paginate: jest.fn(),
    } as unknown as jest.Mocked<BaseRepo<IResourceSchema>>;

    (BaseRepo as jest.Mock).mockImplementation(() => mockBaseRepo);

    resourceRepo = new ResourceRepo();
  });

  describe('create', () => {
    it('should create a new resource', async () => {
      const mockResource: IResourceSchema = {
        title: 'Test Resource',
        description: 'Test Description',
        channelTitle: 'Test Channel',
        thumbnails: { url: 'http://example.com/thumbnail.jpg' },
        statistics: { viewCount: '100', likeCount: '10' },
        sharedBy: { userName: 'Test User', userId: 'user123' },
      };

      mockBaseRepo.create.mockResolvedValue(mockResource);

      const result = await resourceRepo.create(mockResource);

      expect(mockBaseRepo.create).toHaveBeenCalledWith(mockResource);
      expect(result).toEqual(mockResource);
    });

    it('should throw an error if creation fails', async () => {
      const mockResource: IResourceSchema = {
        title: 'Test Resource',
        description: 'Test Description',
        channelTitle: 'Test Channel',
        thumbnails: { url: 'http://example.com/thumbnail.jpg' },
        statistics: { viewCount: '100', likeCount: '10' },
        sharedBy: { userName: 'Test User', userId: 'user123' },
      };

      const error = new Error('Creation failed');
      mockBaseRepo.create.mockRejectedValue(error);

      await expect(resourceRepo.create(mockResource)).rejects.toThrow('Creation failed');
    });
  });

  describe('getAll', () => {
    it('should return all resources', async () => {
      const mockResources: IResourceSchema[] = [
        {
          title: 'Resource 1',
          description: 'Description 1',
          channelTitle: 'Channel 1',
          thumbnails: { url: 'http://example.com/thumbnail1.jpg' },
          statistics: { viewCount: '100', likeCount: '10' },
          sharedBy: { userName: 'User 1', userId: 'user1' },
        },
        {
          title: 'Resource 2',
          description: 'Description 2',
          channelTitle: 'Channel 2',
          thumbnails: { url: 'http://example.com/thumbnail2.jpg' },
          statistics: { viewCount: '200', likeCount: '20' },
          sharedBy: { userName: 'User 2', userId: 'user2' },
        },
      ];

      mockBaseRepo.getAll.mockResolvedValue(mockResources);

      const result = await resourceRepo.getAll();

      expect(mockBaseRepo.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockResources);
    });

    it('should return an empty array if no resources are found', async () => {
      mockBaseRepo.getAll.mockResolvedValue([]);

      const result = await resourceRepo.getAll();

      expect(mockBaseRepo.getAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return a resource by id', async () => {
      const mockResource: IResourceSchema = {
        title: 'Test Resource',
        description: 'Test Description',
        channelTitle: 'Test Channel',
        thumbnails: { url: 'http://example.com/thumbnail.jpg' },
        statistics: { viewCount: '100', likeCount: '10' },
        sharedBy: { userName: 'Test User', userId: 'user123' },
      };

      mockBaseRepo.getById.mockResolvedValue(mockResource);

      const result = await resourceRepo.getById('123');

      expect(mockBaseRepo.getById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockResource);
    });

    it('should return null if resource is not found', async () => {
      mockBaseRepo.getById.mockResolvedValue(null);

      const result = await resourceRepo.getById('nonexistent');

      expect(mockBaseRepo.getById).toHaveBeenCalledWith('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a resource', async () => {
      const mockResource: Partial<IResourceSchema> = {
        title: 'Updated Resource',
        description: 'Updated Description',
      };

      mockBaseRepo.update.mockResolvedValue(mockResource as IResourceSchema);

      const result = await resourceRepo.update('123', mockResource);

      expect(mockBaseRepo.update).toHaveBeenCalledWith('123', mockResource);
      expect(result).toEqual(mockResource);
    });

    it('should throw an error if update fails', async () => {
      const mockResource: Partial<IResourceSchema> = {
        title: 'Updated Resource',
        description: 'Updated Description',
      };

      const error = new Error('Update failed');
      mockBaseRepo.update.mockRejectedValue(error);

      await expect(resourceRepo.update('123', mockResource)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('delete', () => {
    it('should delete a resource', async () => {
      mockBaseRepo.delete.mockResolvedValue(undefined);

      await resourceRepo.delete('123');

      expect(mockBaseRepo.delete).toHaveBeenCalledWith('123');
    });

    it('should throw an error if deletion fails', async () => {
      const error = new Error('Deletion failed');
      mockBaseRepo.delete.mockRejectedValue(error);

      await expect(resourceRepo.delete('123')).rejects.toThrow('Deletion failed');
    });
  });

  describe('paginate', () => {
    it('should paginate resources', async () => {
      const mockResources: IResourceSchema[] = [
        {
          title: 'Resource 1',
          description: 'Description 1',
          channelTitle: 'Channel 1',
          thumbnails: { url: 'http://example.com/thumbnail1.jpg' },
          statistics: { viewCount: '100', likeCount: '10' },
          sharedBy: { userName: 'User 1', userId: 'user1' },
        },
        {
          title: 'Resource 2',
          description: 'Description 2',
          channelTitle: 'Channel 2',
          thumbnails: { url: 'http://example.com/thumbnail2.jpg' },
          statistics: { viewCount: '200', likeCount: '20' },
          sharedBy: { userName: 'User 2', userId: 'user2' },
        },
      ];
      mockBaseRepo.paginate.mockResolvedValue(mockResources);

      const result = await resourceRepo.paginate(10, 0);

      expect(mockBaseRepo.paginate).toHaveBeenCalledWith(10, 0);
      expect(result).toEqual(mockResources);
    });

    it('should throw an error if pagination fails', async () => {
      const error = new Error('Pagination failed');
      mockBaseRepo.paginate.mockRejectedValue(error);

      await expect(resourceRepo.paginate(10, 0)).rejects.toThrow('Pagination failed');
    });
  });
});
