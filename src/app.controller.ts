import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  Query,
  Redirect,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ShortLongMapService } from './short-long-map.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(ShortLongMapService)
  private readonly shortLongMapService: ShortLongMapService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('short-url')
  async getShortUrl(@Query('url') longUrl: string) {
    const shortUrl = await this.shortLongMapService.generate(longUrl);
    const url = `http://192.168.62.129:3000/${shortUrl}`;
    return url;
  }

  @Get(':code')
  @Redirect()
  async jump(@Param('code') code) {
    const longUrl = await this.shortLongMapService.getLongUrl(code);
    if (!longUrl) {
      throw new BadRequestException('短链不存在');
    }
    return {
      url: longUrl,
      statusCode: 302,
    };
  }
}
