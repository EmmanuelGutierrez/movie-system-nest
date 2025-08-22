import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'token',
    example: 'a1b2c3d4e5',
  })
  token: string;
}
