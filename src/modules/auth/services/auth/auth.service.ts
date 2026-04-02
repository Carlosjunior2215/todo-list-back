import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserEntity } from '../../../../shared/entities/user/user.entity';

import * as bcrypt from 'bcryptjs';
import { UserValidationInterface } from '../../protocols/interfaces/userValidation.interface';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../../user/services/user/user.service';

@Injectable()
export class AuthService {
  private user: UserEntity;

  constructor(
    private jwtService: JwtService,
    private readonly userService?: UserService,
  ) {}

  private async userValidation(email: string): Promise<UserEntity | void> {
    const emailFound = await this.userService?.findByEmail(email);

    if (emailFound) {
      return emailFound;
    }

    return;
  }

  private async passwordValidation(originalPassword: string): Promise<boolean> {
    return await bcrypt.compare(originalPassword, this.user.password);
  }

  async validate(user: UserValidationInterface): Promise<{ token: string }> {
    const foundedUser = await this.userValidation(user.email);

    if (!foundedUser) {
      throw new NotFoundException('User not found');
    }

    this.user = foundedUser;
    const result = await this.passwordValidation(user.password);

    if (!result) {
      throw new UnauthorizedException();
    }

    const payload = {
      user: { name: this.user.name, email: this.user.email },
      sub: this.user.id,
    };

    const res = {
      token: await this.jwtService.signAsync(payload),
    };
    return res;
  }
}
