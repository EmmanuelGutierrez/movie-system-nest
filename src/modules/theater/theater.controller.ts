import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TheaterService } from './theater.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { FilterTheaterDto } from './dto/filter.dto';
// import { UpdateTheaterDto } from './dto/update-theater.dto';

@Controller('theater')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}

  @Post()
  create(@Body() createTheaterDto: CreateTheaterDto) {
    return this.theaterService.createTheater(createTheaterDto);
  }

  @Get()
  findAll(@Query() params: FilterTheaterDto) {
    console.log('GET ALL');
    return this.theaterService.getAll(params);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log('GET ONE');
    return this.theaterService.getOneById(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateTheaterDto: UpdateTheaterDto,
  // ) {
  //   return this.theaterService.update(+id, updateTheaterDto);
  // }
}
