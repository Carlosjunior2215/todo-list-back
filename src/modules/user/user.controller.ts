import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user/user.service';
import { UserEntity } from 'src/shared/entities/user/user.entity';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllUsers(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Post()
  async createtUser(
    @Body() user: UserEntity,
    @Res() res: Response,
  ): Promise<any> {
    const serviceResult = await this.userService.createUser(user);
    return res.status(serviceResult.statusCode).send(serviceResult.response);
  }
}
