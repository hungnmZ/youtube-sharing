/* eslint-disable @typescript-eslint/unbound-method */
import { IResourceSchema } from '@frameworks/database/mongodb/models/resource.model';
import { ResourceController } from '@frameworks/webserver/controllers/resource.controller';
import { ResourceService } from '@frameworks/webserver/services/resource.service';
import { SocketService } from '@frameworks/webserver/services/socket.service';
import { BaseError } from '@frameworks/webserver/utils/response/error.response';
import { Response } from 'express';
import { AuthenticatedRequest } from 'types/request';

jest.mock('@frameworks/webserver/services/resource.service');
jest.mock('@frameworks/webserver/services/socket.service');

describe('ResourceController', () => {
  let resourceController: ResourceController;
  let mockResourceService: jest.Mocked<ResourceService>;
  let mockSocketService: jest.Mocked<SocketService>;
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;

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

  beforeEach(() => {
    mockResourceService = {
      share: jest.fn(),
      getAll: jest.fn(),
      paginate: jest.fn(),
    } as unknown as jest.Mocked<ResourceService>;

    mockSocketService = {
      emitEvent: jest.fn(),
    } as unknown as jest.Mocked<SocketService>;

    resourceController = new ResourceController(mockResourceService, mockSocketService);

    mockRequest = {
      body: {},
      auth: { userId: 'testUserId' },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
    };
  });

  describe('getAll', () => {
    it('should successfully retrieve all resources', async () => {
      const mockResources = [mockResourceData, { ...mockResourceData, _id: '2' }];
      mockResourceService.getAll.mockResolvedValue(mockResources);

      await resourceController.getAll(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResourceService.getAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'OK',
          status: 200,
          data: mockResources,
        }),
      );
    });

    it('should handle errors when retrieving resources', async () => {
      mockResourceService.getAll.mockRejectedValue(new Error('Database error'));

      await expect(
        resourceController.getAll(
          mockRequest as AuthenticatedRequest,
          mockResponse as Response,
        ),
      ).rejects.toThrow('Database error');
    });
  });

  describe('share', () => {
    it('should successfully share a resource', async () => {
      const mockVideoInfo = {
        title: 'Test Video',
        channelTitle: 'Test Channel',
        thumbnails: { url: 'http://example.com/thumbnail.jpg' },
        sharedBy: { userName: 'Test User', userId: 'testUserId' },
        description: 'Test Description',
      };
      mockRequest.body = { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' };
      mockResourceService.share.mockResolvedValue(mockVideoInfo);

      await resourceController.share(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResourceService.share).toHaveBeenCalledWith('dQw4w9WgXcQ', 'testUserId');
      expect(mockSocketService.emitEvent).toHaveBeenCalledWith(
        'resource:shared',
        expect.any(String),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.set).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'OK',
          status: 200,
          data: mockVideoInfo,
        }),
      );
    });

    it('should handle different YouTube URL formats', async () => {
      const testCases = [
        { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', expectedId: 'dQw4w9WgXcQ' },
        { url: 'https://youtu.be/dQw4w9WgXcQ', expectedId: 'dQw4w9WgXcQ' },
        { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', expectedId: 'dQw4w9WgXcQ' },
      ];

      for (const testCase of testCases) {
        mockRequest.body = { url: testCase.url };
        mockResourceService.share.mockResolvedValue(mockResourceData);

        await resourceController.share(
          mockRequest as AuthenticatedRequest,
          mockResponse as Response,
        );

        expect(mockResourceService.share).toHaveBeenCalledWith(
          testCase.expectedId,
          'testUserId',
        );
      }
    });

    it('should throw Api400Error for invalid YouTube URL', async () => {
      mockRequest.body = { url: 'https://www.invalid-url.com' };

      await expect(
        resourceController.share(
          mockRequest as AuthenticatedRequest,
          mockResponse as Response,
        ),
      ).rejects.toThrow(BaseError);

      await expect(
        resourceController.share(
          mockRequest as AuthenticatedRequest,
          mockResponse as Response,
        ),
      ).rejects.toThrow('Please enter a valid YouTube video URL');
    });

    it('should handle missing auth information', async () => {
      mockRequest.body = { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' };
      mockRequest.auth = undefined;

      await expect(
        resourceController.share(
          mockRequest as AuthenticatedRequest,
          mockResponse as Response,
        ),
      ).rejects.toThrow(BaseError);

      await expect(
        resourceController.share(
          mockRequest as AuthenticatedRequest,
          mockResponse as Response,
        ),
      ).rejects.toThrow('Unauthorized');
    });

    it('should handle errors from socketService', async () => {
      mockRequest.body = { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' };
      mockResourceService.share.mockResolvedValue(mockResourceData);
      mockSocketService.emitEvent.mockImplementation(() => {
        throw new Error('Socket error');
      });

      await expect(
        resourceController.share(
          mockRequest as AuthenticatedRequest,
          mockResponse as Response,
        ),
      ).rejects.toThrow('Socket error');
    });

    it('should handle errors from resourceService', async () => {
      mockRequest.body = { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' };
      mockResourceService.share.mockRejectedValue(new Error('Service error'));

      await expect(
        resourceController.share(
          mockRequest as AuthenticatedRequest,
          mockResponse as Response,
        ),
      ).rejects.toThrow('Service error');
    });
  });

  describe('paginate', () => {
    it('should successfully paginate resources', async () => {
      const mockPaginationDTO = { limit: 10, skip: 0 };
      const mockResources = [mockResourceData, { ...mockResourceData, _id: '2' }];
      mockResourceService.paginate.mockResolvedValue(mockResources);

      mockRequest.body = mockPaginationDTO;

      await resourceController.paginate(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResourceService.paginate).toHaveBeenCalledWith(10, 0);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'OK',
          status: 200,
          data: mockResources,
        }),
      );
    });

    it('should use default values if not provided', async () => {
      const mockResources = [mockResourceData];
      mockResourceService.paginate.mockResolvedValue(mockResources);

      mockRequest.body = {};

      await resourceController.paginate(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResourceService.paginate).toHaveBeenCalledWith(10, 0);
    });

    it('should handle invalid pagination data', async () => {
      const mockInvalidPaginationDTO = { limit: -1, skip: 'invalid' };
      mockRequest.body = mockInvalidPaginationDTO;

      await expect(
        resourceController.paginate(
          mockRequest as AuthenticatedRequest,
          mockResponse as Response,
        ),
      ).rejects.toThrow(BaseError);

      await expect(
        resourceController.paginate(
          mockRequest as AuthenticatedRequest,
          mockResponse as Response,
        ),
      ).rejects.toThrow('Invalid pagination data');
    });
  });
});
