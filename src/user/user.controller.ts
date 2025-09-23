import {
  Controller,
  Post,
  Body,
  Inject,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RedisService } from 'src/redis/redis.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject()
  private readonly redisService: RedisService;
  @Post('login')
  async login(@Body() loginUserDto: CreateUserDto) {
    const { email, code } = loginUserDto;

    const codeInRedis = await this.redisService.get(`captcha_${email}`);

    if (!codeInRedis) {
      throw new HttpException('验证码已过期', 201);
    }
    if (codeInRedis !== code) {
      throw new UnauthorizedException('验证码错误');
    }

    const user = await this.userService.findUserByEmail(email);

    console.log(user);
    return 'success';
  }
}
