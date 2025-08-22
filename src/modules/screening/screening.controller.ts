import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseInterceptors,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { FilterScreeningDto } from './dto/filter.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { SeatReserveDto } from './dto/reserve-seat.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUserI } from 'src/common/constants/interface/RequestWithUser';
import { ApiBearerAuth } from '@nestjs/swagger';
import { APiPaginatedResponse } from 'src/common/utils/ApiPaginatedResponse';
import { Screening } from './entities/screening.entity';

@UseInterceptors(CacheInterceptor)
@Controller('screening')
export class ScreeningController {
  constructor(private readonly screeningService: ScreeningService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createScreeningDto: CreateScreeningDto) {
    return this.screeningService.createScreening(createScreeningDto);
  }

  @APiPaginatedResponse(Screening)
  @Get()
  findAll(@Query() params: FilterScreeningDto) {
    return this.screeningService.getAll(params);
  }

  @Get('screening-seats/:id')
  findOneSeat(@Param('id', ParseIntPipe) id: number) {
    console.log('id', id);
    return this.screeningService.getScreeningSeats(id);
  }

  @Get('screening-available/:id')
  screeningsAvailableByMovie(@Param('id', ParseIntPipe) id: number) {
    return this.screeningService.screeningsAvailableByMovie(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/reserved-seats/:id')
  getTemporarilyReserveSeat(@Param('id', ParseIntPipe) id: number) {
    return this.screeningService.getReservedSeats(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
    return this.screeningService.getOneById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('update-seat')
  update(@Body() data: UpdateSeatDto) {
    return this.screeningService.updateSeat(data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/temp-reserve-seat')
  tempReserveSeat(
    @Body() data: SeatReserveDto,
    @Request() req: RequestWithUserI,
  ) {
    return this.screeningService.temporarilyReserveGroupSeat(data, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/reserve-seat')
  ReserveSeat(@Body() data: SeatReserveDto, @Request() req: RequestWithUserI) {
    return this.screeningService.reserveSeats(data, req.user.id);
  }
}
