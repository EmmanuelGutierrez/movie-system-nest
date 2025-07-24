import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateScreeningDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsNumber()
  @IsNotEmpty()
  readonly movieId!: number;

  @IsNumber()
  @IsNotEmpty()
  readonly theaterId!: number;

  @IsNumber()
  @IsNotEmpty()
  readonly price!: number;

  @IsNumber()
  @IsNotEmpty()
  readonly startTime!: number;
}
