/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { validate } from 'class-validator';

import { PaginationDTO } from '../../frameworks/webserver/dtos/pagination.dto';

describe('PaginationDTO', () => {
  it('should create a valid PaginationDTO instance', () => {
    const dto = new PaginationDTO({ limit: 10, skip: 5 });
    expect(dto).toBeInstanceOf(PaginationDTO);
    expect(dto.limit).toBe(10);
    expect(dto.skip).toBe(5);
  });

  it('should use default limit if not provided', () => {
    const dto = new PaginationDTO({ skip: 5 });
    expect(dto.limit).toBe(10);
    expect(dto.skip).toBe(5);
  });

  it('should use default skip if not provided', () => {
    const dto = new PaginationDTO({ limit: 20 });
    expect(dto.limit).toBe(20);
    expect(dto.skip).toBe(0);
  });

  it('should use default values if no properties are provided', () => {
    const dto = new PaginationDTO({});
    expect(dto.limit).toBe(10);
    expect(dto.skip).toBe(0);
  });

  it('should validate a correct PaginationDTO', async () => {
    const dto = new PaginationDTO({ limit: 10, skip: 0 });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should allow zero for limit and skip', async () => {
    const dto = new PaginationDTO({ limit: 0, skip: 0 });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for negative limit', async () => {
    const dto = new PaginationDTO({ limit: -1, skip: 0 });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail validation for negative skip', async () => {
    const dto = new PaginationDTO({ limit: 10, skip: -1 });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail validation for non-number limit', async () => {
    const dto = new PaginationDTO({ limit: 'invalid' as any, skip: 0 });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should fail validation for non-number skip', async () => {
    const dto = new PaginationDTO({ limit: 10, skip: 'invalid' as any });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });
});
