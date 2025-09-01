import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUserI } from 'src/common/interface/RequestWithUser';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.creatUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.getAll();
  }

  @Get('me')
  async me(@Req() req: RequestWithUserI) {
    const me = await this.userService.getOneById(req.user.id);
    return me;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getOneById(id);
  }
}
