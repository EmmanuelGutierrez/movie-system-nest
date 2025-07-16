import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMovieParsedDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsNotEmpty()
  readonly description!: string;

  @IsNumber()
  @IsNotEmpty()
  readonly duration!: number;

  @IsNumber()
  @IsNotEmpty()
  readonly release!: number;

  // @IsEnum(movieGenres, { each: true })
  @IsNumber({}, { each: true })
  @IsOptional()
  readonly genres?: number[];

  // @IsOptional()
  // @IsArray()
  // @IsNumber({}, { each: true })
  // readonly actors?: number[];

  // @IsOptional()
  // @IsArray()
  // @IsNumber({}, { each: true })
  // readonly directors?: number[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly directors?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly actors?: string[];
}
