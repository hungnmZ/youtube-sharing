/* eslint-disable @typescript-eslint/unbound-method */
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

  beforeEach(() => {
    mockResourceService = {
      share: jest.fn(),
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

    it('should throw an error for invalid YouTube URL', async () => {
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
});
