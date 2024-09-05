import { IsOptional, IsString } from 'class-validator';

import { BaseDTO } from '../base.dto';

export class UpdateResourceDTO extends BaseDTO {
  constructor(props: UpdateResourceDTO) {
    super(props);
  }

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
