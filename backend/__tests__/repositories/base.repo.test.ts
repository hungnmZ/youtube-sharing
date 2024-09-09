import { IBaseSchema } from '@frameworks/database/mongodb/models/base.model';
import { BaseRepo } from '@frameworks/database/mongodb/repositories/base.repo';
import { Model } from 'mongoose';

// Mock Mongoose Model
class MockModel {
  static create = jest.fn();
  static find = jest.fn();
  static findById = jest.fn();
  static findByIdAndUpdate = jest.fn();
  static deleteOne = jest.fn();
}

// Concrete implementation of BaseRepo for testing
class TestRepo extends BaseRepo<IBaseSchema> {
  constructor() {
    super(MockModel as unknown as Model<IBaseSchema>);
  }
}

describe('BaseRepo', () => {
  let repo: TestRepo;

  beforeEach(() => {
    repo = new TestRepo();
    jest.clearAllMocks();
  });

  it('should create a document', async () => {
    const mockDoc = { id: '1' };
    MockModel.create.mockResolvedValue(mockDoc);

    const result = await repo.create(mockDoc);

    expect(MockModel.create).toHaveBeenCalledWith(mockDoc);
    expect(result).toEqual(mockDoc);
  });

  it('should get all documents', async () => {
    const mockDocs = [{ id: '1' }, { id: '2' }];
    const mockSort = jest.fn().mockResolvedValue(mockDocs);
    MockModel.find.mockReturnValue({ sort: mockSort });

    const result = await repo.getAll();

    expect(MockModel.find).toHaveBeenCalled();
    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(result).toEqual(mockDocs);
  });

  it('should get document by id', async () => {
    const mockDoc = { id: '1' };
    MockModel.findById.mockResolvedValue(mockDoc);

    const result = await repo.getById('1');

    expect(MockModel.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockDoc);
  });

  it('should update a document', async () => {
    const mockDoc = { id: '1', name: 'Updated' };
    MockModel.findByIdAndUpdate.mockResolvedValue(mockDoc);

    const result = await repo.update('1', mockDoc);

    expect(MockModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '1',
      { $set: mockDoc },
      { new: true },
    );
    expect(result).toEqual(mockDoc);
  });

  it('should delete a document', async () => {
    await repo.delete('1');

    expect(MockModel.deleteOne).toHaveBeenCalledWith({ _id: '1' });
  });

  it('should paginate documents', async () => {
    const mockDocs = [{ id: '1' }, { id: '2' }, { id: '3' }];
    const mockSort = jest.fn().mockResolvedValue(mockDocs);
    const mockLimit = jest.fn().mockReturnThis();
    const mockSkip = jest.fn().mockReturnThis();
    MockModel.find.mockReturnValue({
      skip: mockSkip,
      limit: mockLimit,
      sort: mockSort,
    });

    const result = await repo.paginate(2, 1);

    expect(MockModel.find).toHaveBeenCalled();
    expect(mockSkip).toHaveBeenCalledWith(1);
    expect(mockLimit).toHaveBeenCalledWith(2);
    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(result).toEqual(mockDocs);
  });
});
