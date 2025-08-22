import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { FilterCinemaDto } from './dto/filter.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { APiPaginatedResponse } from 'src/common/utils/ApiPaginatedResponse';
import { Cinema } from './entities/cinema.entity';

@Controller('cinema')
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createCinemaDto: CreateCinemaDto) {
    return this.cinemaService.createCinema(createCinemaDto);
  }

  @APiPaginatedResponse(Cinema)
  @Get()
  findAll(@Query() params: FilterCinemaDto) {
    return this.cinemaService.getAll(params);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cinemaService.getOneById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCinemaDto: UpdateCinemaDto,
  ) {
    return this.cinemaService.update(+id, updateCinemaDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cinemaService.remove(+id);
  // }
}
