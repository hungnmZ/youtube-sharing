import { IResourceSchema } from '@frameworks/database/mongodb/models/resource.model';
import { ResourceRepo } from '@frameworks/database/mongodb/repositories/resource.repo';
import { ResourceService } from '@frameworks/webserver/services/resource.service';

jest.mock('@frameworks/database/mongodb/repositories/resource.repo');

describe('ResourceService', () => {
  let resourceService: ResourceService;
  let mockResourceRepo: jest.Mocked<ResourceRepo>;

  beforeEach(() => {
    mockResourceRepo = new ResourceRepo() as jest.Mocked<ResourceRepo>;
    resourceService = new ResourceService(mockResourceRepo);
  });

  it('should create a resource', async () => {
    const mockResource: IResourceSchema = {
      name: 'Test Resource',
      description: 'Test Description',
    };

    mockResourceRepo.create.mockResolvedValue(mockResource);

    const createSpy = jest
      .spyOn(mockResourceRepo, 'create')
      .mockResolvedValue(mockResource);

    const result = await resourceService.create(mockResource);

    expect(createSpy).toHaveBeenCalledWith(mockResource);
    expect(result).toEqual(mockResource);
  });

  it('should get all resources', async () => {
    const mockResources: IResourceSchema[] = [
      { name: 'Resource 1', description: 'Description 1' },
      { name: 'Resource 2', description: 'Description 2' },
    ];

    const getAllSpy = jest
      .spyOn(mockResourceRepo, 'getAll')
      .mockResolvedValue(mockResources);

    const result = await resourceService.getAll();

    expect(getAllSpy).toHaveBeenCalled();
    expect(result).toEqual(mockResources);
  });

  it('should get a resource by id', async () => {
    const mockResource: IResourceSchema = {
      name: 'Test Resource',
      description: 'Test Description',
    };

    const getByIdSpy = jest
      .spyOn(mockResourceRepo, 'getById')
      .mockResolvedValue(mockResource);

    const result = await resourceService.getById('123');

    expect(getByIdSpy).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockResource);
  });

  it('should update a resource', async () => {
    const mockResource: IResourceSchema = {
      name: 'Updated Resource',
      description: 'Updated Description',
    };

    const updateSpy = jest
      .spyOn(mockResourceRepo, 'update')
      .mockResolvedValue(mockResource);

    const result = await resourceService.update('123', mockResource);

    expect(updateSpy).toHaveBeenCalledWith('123', mockResource);
    expect(result).toEqual(mockResource);
  });

  it('should delete a resource', async () => {
    const deleteSpy = jest.spyOn(mockResourceRepo, 'delete').mockResolvedValue(undefined);

    await resourceService.delete('123');

    expect(deleteSpy).toHaveBeenCalledWith('123');
  });
});
