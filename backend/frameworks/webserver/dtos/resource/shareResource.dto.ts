import { IsString, IsUrl } from 'class-validator';

import { BaseDTO } from '../base.dto';

export class ShareResourceDTO extends BaseDTO {
  constructor(props: ShareResourceDTO) {
    super(props);
  }

  @IsUrl()
  @IsString()
  url: string;
}
