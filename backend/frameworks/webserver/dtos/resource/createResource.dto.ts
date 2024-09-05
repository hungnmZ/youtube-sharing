import { IsNotEmpty, IsString } from 'class-validator';

import { BaseDTO } from '../base.dto';

export class CreateResourceDTO extends BaseDTO {
  constructor(props: CreateResourceDTO) {
    super(props);
  }

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
