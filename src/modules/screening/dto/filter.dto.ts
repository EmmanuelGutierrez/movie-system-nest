import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class FilterScreeningDto {
  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  startTime?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @IsOptional()
  @IsString()
  name?: string;
}
