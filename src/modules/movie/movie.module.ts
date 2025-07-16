import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { Movie } from './entities/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from '../file/file.module';
import { GenreModule } from './genre/genre.module';
import { PersonModule } from './person/person.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    FileModule,
    GenreModule,
    PersonModule,
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
