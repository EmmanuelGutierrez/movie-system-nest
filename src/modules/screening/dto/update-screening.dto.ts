import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateScreeningDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsNumber()
  @IsOptional()
  readonly movieId?: number;

  @IsNumber()
  @IsOptional()
  readonly price?: number;
}
