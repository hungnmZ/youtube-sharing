import { IsNumber, Min } from 'class-validator';

import { BaseDTO } from './base.dto';

export class PaginationDTO extends BaseDTO {
  constructor(props: Partial<PaginationDTO>) {
    super(props);
    this.limit = props.limit || 10; // Set default value to 10
    this.skip = props.skip || 0; // Set default value to 10
  }

  @IsNumber()
  @Min(0)
  limit: number;

  @IsNumber()
  @Min(0)
  skip: number;
}
