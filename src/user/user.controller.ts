import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './entities/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  jwtService: JwtService;

  @Post('login')
  login(@Body() loginDto: LoginUserDto) {
    if (loginDto.username !== 'admin' || loginDto.password !== 'admin') {
      throw new BadRequestException('用户名或密码错误');
    }
    const jwt = this.jwtService.sign(
      { username: loginDto.username },
      { expiresIn: '7d' },
    );
    return { access_token: jwt };
  }
}
