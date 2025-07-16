import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { FileService } from '../file/file.service';
import { CreateMovieDto } from './dto/create-movie.dto';
// import { CreateMovieParsedDto } from './dto/create-movie-parsed.dto';
import { PhotosPoster } from 'src/common/constants/types/multiple-files.type';
import { UpdateMovieParsedDto } from './dto/update-movie-parsed.dto';
import { FilterDto } from './dto/filter.dto';
import { PersonService } from './person/person.service';
import { GenreService } from './genre/genre.service';
import { Person } from './person/entities/person.entity';
import { Genre } from './genre/entities/genre.entity';
import { CreateMoviePhotosDto } from './dto/create-movie-photos.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie) private readonly movieRepo: Repository<Movie>,
    private readonly fileService: FileService,
    private readonly personService: PersonService,
    private readonly genreService: GenreService,
  ) {}

  async createMovie({
    imageBase64,
    actors,
    directors,
    genres,
    ...data
  }: CreateMovieDto) {
    const image = await this.fileService.createBase64(
      imageBase64,
      // movie.id,
      `movies/files/posters`,
    );

    const actorsMovie: Person[] = [];
    const directorsMovie: Person[] = [];

    if (actors && actors.length) {
      for (const actorName of actors) {
        const actor = await this.personService.findByNameAndLastName(actorName);
        if (actor) {
          actorsMovie.push(actor);
        } else {
          const actor = await this.personService.create({ name: actorName });
          actorsMovie.push(actor);
        }
      }
    }

    if (directors && directors.length) {
      for (const actorName of directors) {
        const actor = await this.personService.findByNameAndLastName(actorName);
        if (actor) {
          directorsMovie.push(actor);
        } else {
          const actor = await this.personService.create({ name: actorName });
          directorsMovie.push(actor);
        }
      }
    }

    let genresEntities: Genre[] = [];
    if (genres && genres.length) {
      genresEntities = await this.genreService.findByIds(genres);
    }

    const movie = this.movieRepo.create({
      ...data,
      poster: image,
      actors: actorsMovie,
      directors: directorsMovie,
      genres: genresEntities,
    });

    const newMovie = await this.movieRepo.save(movie);
    return newMovie;
  }

  async createMoviePhotos(
    { genres, actors, directors, ...data }: CreateMoviePhotosDto,
    files: PhotosPoster,
  ) {
    const actorsMovie: Person[] = [];
    const directorsMovie: Person[] = [];

    if (actors && actors.length) {
      for (const actorName of actors) {
        const actor = await this.personService.findByNameAndLastName(actorName);
        if (actor) {
          actorsMovie.push(actor);
        } else {
          const actor = await this.personService.create({ name: actorName });
          actorsMovie.push(actor);
        }
      }
    }

    if (directors && directors.length) {
      for (const actorName of directors) {
        const actor = await this.personService.findByNameAndLastName(actorName);
        if (actor) {
          directorsMovie.push(actor);
        } else {
          const actor = await this.personService.create({ name: actorName });
          directorsMovie.push(actor);
        }
      }
    }

    let genresEntities: Genre[] = [];
    if (genres && genres.length) {
      genresEntities = await this.genreService.findByIds(genres);
    }

    console.log('movie', !files);
    // const newMovieData: any = {
    //   ...data,
    //   genres: genresEntities,
    //   actors: actorsMovie,
    //   directors: directorsMovie,
    //   poster: undefined,
    //   photos: undefined,
    // };
    const movie = this.movieRepo.create({
      ...data,
      genres: genresEntities,
      actors: actorsMovie,
      directors: directorsMovie,
    });

    const savedMovie = await this.movieRepo.save(movie);

    if (files && files.poster) {
      console.log('FILE');
      const poster = await this.fileService.create(
        files.poster[0],
        `movies/files/posters`,
      );
      console.log(poster);
      this.movieRepo.merge(savedMovie, { poster });
      console.log('pasamos 1');
    }
    if (files && files.photos) {
      console.log('pasamos 2');
      const photos = await this.fileService.createMany({
        filesData: files.photos,
        // external_id: movie.id,
        folder: `movies/files/photos `,
        toBase64: true,
      });
      console.log('pasamos 3');
      this.movieRepo.merge(savedMovie, { photos });
      console.log('pasamos 4');
    }
    return await this.movieRepo.save(savedMovie);
  }

  async update(
    movieId: number,
    { genres, directors, actors, ...data }: UpdateMovieParsedDto,
    files: PhotosPoster,
  ) {
    const movie = await this.getOneById(movieId);
    if (files && files.poster && movie.poster) {
      console.log('POSTER'); //VERIFICAR POR QUE AL REVES NO FUNCIONA
      const poster = await this.fileService.create(
        files.poster[0],
        `movies/files/posters`,
      );
      await this.fileService.deleteFile(movie.poster.id);
      movie.poster = poster;
    }
    if (files && files.photos && movie.photos) {
      const photosId: number[] = [];
      const publics_ids: string[] = [];
      movie.photos.forEach((p) => {
        photosId.push(p.id);
        publics_ids.push(p.public_id);
      });
      await this.fileService.deleteFileMany({
        ids: photosId,
        public_ids: publics_ids,
      });
      const photos = await this.fileService.createMany({
        filesData: files.photos,
        // external_id: movie.id,
        folder: `movies/files/posters`,
        toBase64: true,
      });
      movie.photos = photos;
    }

    const actorsMovie: Person[] = [];
    const directorsMovie: Person[] = [];

    if (actors && actors.length) {
      for (const actorName of actors) {
        const actor = await this.personService.findByNameAndLastName(actorName);
        if (actor) {
          actorsMovie.push(actor);
        } else {
          const actor = await this.personService.create({ name: actorName });
          actorsMovie.push(actor);
        }
      }
      movie.actors = actorsMovie;
    }

    if (directors && directors.length) {
      for (const actorName of directors) {
        const actor = await this.personService.findByNameAndLastName(actorName);
        if (actor) {
          directorsMovie.push(actor);
        } else {
          const actor = await this.personService.create({ name: actorName });
          directorsMovie.push(actor);
        }
      }
      movie.directors = directorsMovie;
    }

    let genresEntities: Genre[] = [];
    if (genres && genres.length) {
      genresEntities = await this.genreService.findByIds(genres);
      movie.genres = genresEntities;
    }
    this.movieRepo.merge(movie, data);
    // const res = await this.movieRepo.updateOne({ _id: movieId }, data);
    return await this.movieRepo.save(movie);
  }

  async getAll(params: FilterDto) {
    const { page = 1, description, genres, limit = 10 } = params;
    // const movies = await this.movieRepo.find();
    // const options: FindManyOptions<Movie> = {};
    // const optionsWithQuery: any = { where: [] };
    // if (genres && genres.length) {
    //   options.where = { ...options.where, 'movie.genres && :genres': genres };
    // }
    // if (description) {
    //   filters.description = { $rejex: description };
    // }
    // filters.active = true;
    // const movies = await this.movieRepo.find();

    // const total = await this.movieRepo.countDocuments();
    // return { page, inThisPage: movies.length, total, data: movies };

    const qb = this.movieRepo
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.directors', 'directors')
      .leftJoinAndSelect('movie.actors', 'actors');
    // qb.where('movie.active = :active', { active: true });
    if (description) {
      qb.andWhere('movie.description LIKE :description', {
        description: `%${description}%`,
      });
    }
    if (genres && genres.length) {
      qb.andWhere('genre.name IN (:...genres)', { genres });
    }
    qb.skip((page - 1) * limit).take(limit);
    const total = await this.movieRepo.count();
    console.log('qr', qb.getQuery());
    console.log('params', qb.getParameters());
    const movies = await qb.getMany();
    return { page, inThisPage: movies.length, total, data: movies };
  }

  async getOneById(id: number) {
    // const movies = await this.movieRepo.find();
    const movie = await this.movieRepo.findOne({
      where: { id },
      relations: { photos: true, poster: true },
    });
    if (!movie) {
      throw new NotFoundException('Not found');
    }
    return movie;
  }

  async logicDelete(movieId: number) {
    const movie = await this.getOneById(movieId);
    const res = await this.movieRepo.update(
      { id: movieId },
      { active: !movie.active },
    );

    return res;
  }
}
