import {
  Controller,
  Get,
  Post,
  Body /*, Patch, Param, Delete */,
  Query,
  UseInterceptors,
  // UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { FilterDto } from './dto/filter.dto';
import { CreateMoviePhotosDto } from './dto/create-movie-photos.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ImageFilesValidationPipe } from 'src/common/pipes/ImageFilesValidationPipe.pipe';
import { PhotosPoster } from 'src/common/constants/types/multiple-files.type';
// import { CreateMovieDto } from './dto/create-movie-photos.dto';
// import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  // @Post()
  // create(@Body() createMovieDto: CreateMovieDto) {
  //   return this.movieService.create(createMovieDto);
  // }

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

  @Get()
  findAll(@Query() querys: FilterDto) {
    return this.movieService.getAll(querys);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.movieService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
  //   return this.movieService.update(+id, updateMovieDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.movieService.remove(+id);
  // }
}
