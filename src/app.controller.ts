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

  @Get('allPos')
  async allPos() {
    return await this.redisService.geoList('positions');
  }

  @Get('pos')
  async pos(@Query('name') name: string) {
    return await this.redisService.geoPos('positions', name);
  }

  @Get('nearbySearch')
  async nearbySearch(
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('radius') radius: number,
  ) {
    if (!longitude || !latitude) {
      throw new BadRequestException('缺少位置信息');
    }
    if (!radius) {
      throw new BadRequestException('缺少搜索半径');
    }
    return await this.redisService.getSearch(
      'positions',
      [longitude, latitude],
      radius,
    );
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
