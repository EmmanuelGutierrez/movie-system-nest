import {
  Controller,
  Get,
  Post,
  Body /*, Patch, Param, Delete */,
  Query,
  UseInterceptors,
  // UploadedFile,
  UploadedFiles,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { FilterDto } from './dto/filter.dto';
import { CreateMoviePhotosDto } from './dto/create-movie-photos.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ImageFilesValidationPipe } from 'src/common/pipes/ImageFilesValidationPipe.pipe';
import { PhotosPoster } from 'src/common/types/multiple-files.type';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { APiPaginatedResponse } from 'src/common/utils/ApiPaginatedResponse';
import { Movie } from './entities/movie.entity';
import { Request } from 'express';
// import { CreateMovieDto } from './dto/create-movie-photos.dto';
// import { UpdateMovieDto } from './dto/update-movie.dto';

@UseInterceptors(CacheInterceptor)
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  // @Post()
  // create(@Body() createMovieDto: CreateMovieDto) {
  //   return this.movieService.create(createMovieDto);
  // }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'poster', maxCount: 1 },
      { name: 'photos', maxCount: 5 },
    ]),
  )
  create(
    @UploadedFiles(
      // new ParseFilePipe({
      //   validators: [
      //     new FileTypeValidator({
      //       // fileType: /(jpeg|jpg|png|svg|webp|bmp|jfif)$/i,
      //       fileType: 'image/jpg',
      //     }),
      //   ],
      //   fileIsRequired: true,
      // }),
      new ImageFilesValidationPipe(),
    )
    files: PhotosPoster,
    @Body()
    createMovieDto: CreateMoviePhotosDto,
  ) {
    // console.log('createMovieDto', createMovieDto, files);
    return this.movieService.createMoviePhotos(createMovieDto, files);
  }

  // @UseGuards(AuthGuard('jwt'))
  @APiPaginatedResponse(Movie)
  @Get()
  findAll(@Query() querys: FilterDto, @Req() request: Request) {
    console.log('req', request.cookies, request.signedCookies, request.path);
    return this.movieService.getAll(querys);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.getOneById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
  //   return this.movieService.update(+id, updateMovieDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.movieService.remove(+id);
  // }
}
