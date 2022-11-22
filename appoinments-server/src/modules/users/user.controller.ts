import { UserCreateDto } from './dto/user-create.dto';
import { Controller, Get, Post, Body, Put, Param, HttpException, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async get() {
    return this.service.get();
  }

  @Get('type-user')
  async getUserType() {
    return this.service.getTypeUser();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req) {
    return this.service.findById(req.user.userId);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.service.findById(id);
  }

  @Post()
  async create(@Body() user: UserCreateDto) {
    return this.service.create(user);
  }

  @Put('active/:id')
  async active(@Param('id') id: number) {
    try {
      const { affected } = await this.service.update({ status: 1 }, id);
      if (affected) {
        return {
          message: 'Kích hoạt user thành công',
        };
      }

      throw new HttpException('Đã có lỗi xảy ra, vui lòng thử lại sau', HttpStatus.BAD_REQUEST);
    } catch (e) {
      return {
        code: 500,
        message: e,
      };
    }
  }

  @Put('de-active/:id')
  async deActive(@Param('id') id: number) {
    try {
      const { affected } = await this.service.update({ status: 0 }, id);

      if (affected) {
        return {
          message: 'Hủy kích hoạt user thành công',
        };
      }

      throw new HttpException('Đã có lỗi xảy ra, vui lòng thử lại sau', HttpStatus.BAD_REQUEST);
    } catch (e) {
      return {
        code: 500,
        message: e,
      };
    }
  }
}
