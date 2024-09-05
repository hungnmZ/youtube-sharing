import { IResourceSchema } from '@frameworks/database/mongodb/models/resource.model';
import { ResourceController } from '@frameworks/webserver/controllers/resource.controller';
import { ResourceService } from '@frameworks/webserver/services/resource.service';
import { Request, Response } from 'express';

jest.mock('@frameworks/webserver/services/resource.service');

describe('ResourceController', () => {
  let resourceController: ResourceController;
  let mockResourceService: jest.Mocked<ResourceService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResourceService = new ResourceService(null) as jest.Mocked<ResourceService>;
    resourceController = new ResourceController(mockResourceService);

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
    };
  });

  it('should create a resource', async () => {
    const mockResource: IResourceSchema = {
      name: 'Test Resource',
      description: 'Test Description',
    };

    mockRequest.body = mockResource;
    const createSpy = jest
      .spyOn(mockResourceService, 'create')
      .mockResolvedValue(mockResource);

    await resourceController.create(mockRequest as Request, mockResponse as Response);

    expect(createSpy).toHaveBeenCalledWith(mockResource);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: mockResource,
      }),
    );
  });

  it('should get all resources', async () => {
    const mockResources = [
      { name: 'Resource 1', description: 'Description 1' },
      { name: 'Resource 2', description: 'Description 2' },
    ];
    const getAllSpy = jest
      .spyOn(mockResourceService, 'getAll')
      .mockResolvedValue(mockResources);

    await resourceController.getAll(mockRequest as Request, mockResponse as Response);

    expect(getAllSpy).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: mockResources,
      }),
    );
  });

  it('should get a resource by id', async () => {
    const mockResource = {
      id: '123',
      name: 'Test Resource',
      description: 'Test Description',
    };
    mockRequest.params = { id: '123' };
    const getByIdSpy = jest
      .spyOn(mockResourceService, 'getById')
      .mockResolvedValue(mockResource);

    await resourceController.getById(mockRequest as Request, mockResponse as Response);

    expect(getByIdSpy).toHaveBeenCalledWith('123');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: mockResource,
      }),
    );
  });

  it('should update a resource', async () => {
    const mockResource = { name: 'Updated Resource', description: 'Updated Description' };
    mockRequest.params = { id: '123' };
    mockRequest.body = mockResource;
    const updateSpy = jest
      .spyOn(mockResourceService, 'update')
      .mockResolvedValue({ ...mockResource });

    await resourceController.update(mockRequest as Request, mockResponse as Response);

    expect(updateSpy).toHaveBeenCalledWith('123', mockResource);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { ...mockResource },
      }),
    );
  });

  it('should delete a resource', async () => {
    mockRequest.params = { id: '123' };
    const deleteSpy = jest.spyOn(mockResourceService, 'delete').mockResolvedValue();

    await resourceController.delete(mockRequest as Request, mockResponse as Response);

    expect(deleteSpy).toHaveBeenCalledWith('123');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {},
        message: 'OK',
        status: 200,
      }),
    );
  });
});
