import { IBaseRepo } from '@application/repositories/IBase.repo';
import { IBaseSchema } from '@frameworks/database/mongodb/models/base.model';
import { BaseServices } from '@frameworks/webserver/services/base.service';

// Mock implementation of IBaseRepo
class MockRepo implements IBaseRepo<IBaseSchema> {
  create = jest.fn();
  getAll = jest.fn();
  getById = jest.fn();
  update = jest.fn();
  delete = jest.fn();
  paginate = jest.fn();
}

// Concrete implementation of BaseServices for testing
class TestService extends BaseServices<IBaseSchema> {
  constructor(repo: IBaseRepo<IBaseSchema>) {
    super(repo);
  }
}

describe('BaseServices', () => {
  let service: TestService;
  let mockRepo: MockRepo;

  beforeEach(() => {
    mockRepo = new MockRepo();
    service = new TestService(mockRepo);
  });

  it('should create an item', async () => {
    const mockItem = { id: '1' };
    mockRepo.create.mockResolvedValue(mockItem);

    const result = await service.create(mockItem);

    expect(mockRepo.create).toHaveBeenCalledWith(mockItem);
    expect(result).toEqual(mockItem);
  });

  it('should get all items', async () => {
    const mockItems = [{ id: '1' }, { id: '2' }];
    mockRepo.getAll.mockResolvedValue(mockItems);

    const result = await service.getAll();

    expect(mockRepo.getAll).toHaveBeenCalled();
    expect(result).toEqual(mockItems);
  });

  it('should get item by id', async () => {
    const mockItem = { id: '1' };
    mockRepo.getById.mockResolvedValue(mockItem);

    const result = await service.getById('1');

    expect(mockRepo.getById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockItem);
  });

  it('should update an item', async () => {
    const mockItem = { id: '1', name: 'Updated' };
    mockRepo.update.mockResolvedValue(mockItem);

    const result = await service.update('1', mockItem);

    expect(mockRepo.update).toHaveBeenCalledWith('1', mockItem);
    expect(result).toEqual(mockItem);
  });

  it('should delete an item', async () => {
    await service.delete('1');

    expect(mockRepo.delete).toHaveBeenCalledWith('1');
  });

  it('should paginate items', async () => {
    const mockItems = [{ id: '1' }, { id: '2' }];
    mockRepo.paginate.mockResolvedValue(mockItems);

    const result = await service.paginate(10, 0);

    expect(mockRepo.paginate).toHaveBeenCalledWith(10, 0);
    expect(result).toEqual(mockItems);
  });
});
