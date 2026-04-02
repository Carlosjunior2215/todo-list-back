import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { Request, Response } from 'express';
import { LocalGuard } from './guards/local.guard';
import { UserValidationInterface } from './protocols/interfaces/userValidation.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: Request, @Res() res: Response): Promise<any> {
    const token = await this.authService.validate(req.body as UserValidationInterface);
    res.status(200).send(token);
  }
}
