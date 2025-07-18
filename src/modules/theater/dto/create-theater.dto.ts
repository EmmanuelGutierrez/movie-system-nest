import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTheaterDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsNumber()
  @IsNotEmpty()
  readonly cinemaId!: number;

  @IsNumber()
  @IsNotEmpty()
  readonly rows!: number;

  @IsNumber()
  @IsNotEmpty()
  readonly seatsPerRow!: number;
}
