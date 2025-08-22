import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  inThisPage: number;
}
