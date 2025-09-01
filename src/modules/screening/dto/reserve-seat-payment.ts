import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReserveSeatPaymentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  preferenceId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  temporalTransactionId!: string;
}
