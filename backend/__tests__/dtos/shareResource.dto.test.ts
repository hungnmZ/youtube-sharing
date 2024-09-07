/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { validate } from 'class-validator';

import { ShareResourceDTO } from '../../frameworks/webserver/dtos/resource/shareResource.dto';

describe('ShareResourceDTO', () => {
  it('should create a valid ShareResourceDTO instance', () => {
    const dto = new ShareResourceDTO({ url: 'https://example.com' });
    expect(dto).toBeInstanceOf(ShareResourceDTO);
    expect(dto.url).toBe('https://example.com');
  });

  it('should validate a correct URL', async () => {
    const dto = new ShareResourceDTO({ url: 'https://example.com' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for an invalid URL', async () => {
    const dto = new ShareResourceDTO({ url: 'not-a-url' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUrl');
  });

  it('should fail validation for a non-string URL', async () => {
    const dto = new ShareResourceDTO({ url: 123 as any });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should fail validation for a missing URL', async () => {
    const dto = new ShareResourceDTO({} as any);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUrl');
  });
});
