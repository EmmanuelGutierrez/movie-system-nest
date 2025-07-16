import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { valueTransform } from 'src/common/utils/ValueTransform';
export class CreateMoviePhotosDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsNotEmpty()
  readonly description!: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => {
    return valueTransform(value);
  })
  readonly duration!: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => {
    return valueTransform(value);
  })
  readonly release!: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }: { value: string }) => {
    return valueTransform(value);
  })
  readonly directors?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }: { value: string }) => {
    return valueTransform(value);
  })
  readonly actors?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }: { value: string }) => {
    return valueTransform(value);
  })
  readonly genres?: number[];
}
