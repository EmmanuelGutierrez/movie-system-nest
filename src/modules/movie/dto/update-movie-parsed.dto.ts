import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMovieParsedDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsNumber()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  @IsOptional()
  readonly duration?: number;

  @IsString()
  @IsOptional()
  readonly release?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly genres?: number[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly actors?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly directors?: string[];
}
