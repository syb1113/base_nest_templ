import { RedisService } from 'src/redis/redis.service';
import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(RedisService)
  private redisService: RedisService;

  @Get('addPos')
  async addPos(
    @Query('name') posName: string,
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
  ) {
    if (!posName || !longitude || !latitude) {
      throw new BadRequestException('位置信息不全');
    }
    try {
      await this.redisService.geoAdd('positions', posName, [
        longitude,
        latitude,
      ]);
    } catch (e) {
      throw new BadRequestException(e);
    }

    return {
      code: 200,
      message: '添加成功',
    };
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
