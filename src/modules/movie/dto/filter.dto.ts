import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { movieGenres } from 'src/common/enum/genres.enum';

export class FilterDto {
  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  page?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: movieGenres[];

  @IsOptional()
  @IsString()
  description?: string;
}
