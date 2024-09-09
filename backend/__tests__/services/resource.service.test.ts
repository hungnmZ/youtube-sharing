/* eslint-disable @typescript-eslint/unbound-method */
import { clerkClient } from '@clerk/clerk-sdk-node';
import { IResourceSchema } from '@frameworks/database/mongodb/models/resource.model';
import { ResourceRepo } from '@frameworks/database/mongodb/repositories/resource.repo';
import { fetchYoutubeVideoInfo } from '@frameworks/webserver/helpers/resource.helper';
import { ResourceService } from '@frameworks/webserver/services/resource.service';
import { BaseError } from '@frameworks/webserver/utils/response/error.response';

jest.mock('@frameworks/database/mongodb/repositories/resource.repo');
jest.mock('@clerk/clerk-sdk-node', () => ({
  clerkClient: {
    users: {
      getUser: jest.fn(),
    },
  },
}));
jest.mock('@frameworks/webserver/helpers/resource.helper');

describe('ResourceService', () => {
  let resourceService: ResourceService;
  let mockResourceRepo: jest.Mocked<ResourceRepo>;

  beforeEach(() => {
    mockResourceRepo = new ResourceRepo() as jest.Mocked<ResourceRepo>;
    resourceService = new ResourceService(mockResourceRepo);
    jest.clearAllMocks();
  });

  const mockResourceData: IResourceSchema = {
    title: 'Test Resource',
    description: 'Test Description',
    channelTitle: 'Test Channel',
    thumbnails: {
      url: 'http://example.com/thumbnail.jpg',
      width: 120,
      height: 90,
    },
    statistics: {
      viewCount: '100',
      likeCount: '10',
      dislikeCount: '1',
      commentCount: '5',
    },
    sharedBy: {
      userName: 'Test User',
      userId: 'user123',
    },
  };

  describe('create', () => {
    it('should create a resource', async () => {
      mockResourceRepo.create.mockResolvedValue(mockResourceData);

      const result = await resourceService.create(mockResourceData);

      expect(mockResourceRepo.create).toHaveBeenCalledWith(mockResourceData);
      expect(result).toEqual(mockResourceData);
    });

    it('should throw an error if creation fails', async () => {
      mockResourceRepo.create.mockRejectedValue(new Error('Creation failed'));

      await expect(resourceService.create(mockResourceData)).rejects.toThrow(
        'Creation failed',
      );
    });
  });

  describe('getAll', () => {
    it('should get all resources', async () => {
      const mockResources: IResourceSchema[] = [
        mockResourceData,
        { ...mockResourceData, title: 'Resource 2' },
      ];

      mockResourceRepo.getAll.mockResolvedValue(mockResources);

      const result = await resourceService.getAll();

      expect(mockResourceRepo.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockResources);
    });
  });

  describe('getById', () => {
    it('should get a resource by id', async () => {
      mockResourceRepo.getById.mockResolvedValue(mockResourceData);

      const result = await resourceService.getById('123');

      expect(mockResourceRepo.getById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockResourceData);
    });

    it('should return null if resource is not found', async () => {
      mockResourceRepo.getById.mockResolvedValue(null);

      const result = await resourceService.getById('nonexistent');

      expect(mockResourceRepo.getById).toHaveBeenCalledWith('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a resource', async () => {
      const updatedResource = { ...mockResourceData, title: 'Updated Resource' };

      mockResourceRepo.update.mockResolvedValue(updatedResource);

      const result = await resourceService.update('123', updatedResource);

      expect(mockResourceRepo.update).toHaveBeenCalledWith('123', updatedResource);
      expect(result).toEqual(updatedResource);
    });

    it('should throw an error if update fails', async () => {
      mockResourceRepo.update.mockRejectedValue(new Error('Update failed'));

      await expect(resourceService.update('123', mockResourceData)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('delete', () => {
    it('should delete a resource', async () => {
      mockResourceRepo.delete.mockResolvedValue(undefined);

      await resourceService.delete('123');

      expect(mockResourceRepo.delete).toHaveBeenCalledWith('123');
    });

    it('should throw an error if deletion fails', async () => {
      mockResourceRepo.delete.mockRejectedValue(new Error('Deletion failed'));

      await expect(resourceService.delete('123')).rejects.toThrow('Deletion failed');
    });
  });

  describe('share', () => {
    const videoId = 'testVideoId';
    const userId = 'testUserId';
    const mockVideoInfo = {
      snippet: {
        title: 'Test Video',
        description: 'Test Description',
        channelTitle: 'Test Channel',
        thumbnails: {
          maxres: { url: 'http://example.com/thumbnail.jpg', width: 1280, height: 720 },
        },
      },
      statistics: {
        viewCount: '100',
        likeCount: '10',
        dislikeCount: '1',
        commentCount: '5',
      },
    };

    it('should successfully share a resource', async () => {
      (fetchYoutubeVideoInfo as jest.Mock).mockResolvedValue(mockVideoInfo);
      (clerkClient.users.getUser as jest.Mock).mockResolvedValue({
        fullName: 'Test User',
        username: 'testuser',
      });
      mockResourceRepo.create.mockResolvedValue({
        sharedBy: { userName: 'Test User', userId },
        title: mockVideoInfo.snippet.title,
        description: mockVideoInfo.snippet.description,
        channelTitle: mockVideoInfo.snippet.channelTitle,
        thumbnails: mockVideoInfo.snippet.thumbnails.maxres,
        statistics: mockVideoInfo.statistics,
      });

      const result = await resourceService.share(videoId, userId);

      expect(fetchYoutubeVideoInfo).toHaveBeenCalledWith(videoId);
      expect(clerkClient.users.getUser).toHaveBeenCalledWith(userId);
      expect(mockResourceRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Video',
          description: 'Test Description',
          channelTitle: 'Test Channel',
          thumbnails: mockVideoInfo.snippet.thumbnails.maxres,
          statistics: mockVideoInfo.statistics,
          sharedBy: { userName: 'Test User', userId },
        }),
      );
      expect(result).toEqual(
        expect.objectContaining({
          title: 'Test Video',
          sharedBy: { userName: 'Test User', userId },
        }),
      );
    });

    it('should throw Api400Error if video info is not found', async () => {
      (fetchYoutubeVideoInfo as jest.Mock).mockResolvedValue(null);

      await expect(resourceService.share(videoId, userId)).rejects.toThrow(BaseError);
      await expect(resourceService.share(videoId, userId)).rejects.toThrow(
        'Video is private or does not exist',
      );
    });

    it('should use username if fullName is not available', async () => {
      (fetchYoutubeVideoInfo as jest.Mock).mockResolvedValue(mockVideoInfo);
      (clerkClient.users.getUser as jest.Mock).mockResolvedValue({
        fullName: null,
        username: 'testuser',
      });
      mockResourceRepo.create.mockResolvedValue({
        title: 'Test Video',
        description: 'Test Description',
        channelTitle: 'Test Channel',
        thumbnails: mockVideoInfo.snippet.thumbnails.maxres,
        statistics: mockVideoInfo.statistics,
        sharedBy: { userName: 'testuser', userId },
      });

      const result = await resourceService.share(videoId, userId);

      expect(result.sharedBy.userName).toBe('testuser');
    });

    it('should throw error if user information cannot be fetched', async () => {
      (fetchYoutubeVideoInfo as jest.Mock).mockResolvedValue(mockVideoInfo);
      (clerkClient.users.getUser as jest.Mock).mockRejectedValue(
        new Error('User not found'),
      );

      await expect(resourceService.share(videoId, userId)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('paginate', () => {
    it('should paginate resources', async () => {
      const mockResources = [
        mockResourceData,
        { ...mockResourceData, title: 'Resource 2' },
      ];
      mockResourceRepo.paginate.mockResolvedValue(mockResources);

      const result = await resourceService.paginate(10, 0);

      expect(mockResourceRepo.paginate).toHaveBeenCalledWith(10, 0);
      expect(result).toEqual(mockResources);
    });

    it('should throw an error if pagination fails', async () => {
      mockResourceRepo.paginate.mockRejectedValue(new Error('Pagination failed'));

      await expect(resourceService.paginate(10, 0)).rejects.toThrow('Pagination failed');
    });
  });
});
