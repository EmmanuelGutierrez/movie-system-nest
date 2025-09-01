import { ApiProperty } from '@nestjs/swagger';

export class UrlsDto {
  @ApiProperty()
  success?: string;

  @ApiProperty()
  pending?: string;

  @ApiProperty()
  failure?: string;
}
