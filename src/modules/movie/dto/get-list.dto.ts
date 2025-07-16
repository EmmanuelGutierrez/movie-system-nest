import { Movie } from '../entities/movie.entity';

export class GetListDto {
  page!: number;

  total!: number;

  inThisPage!: number;

  data!: Movie[];
}
