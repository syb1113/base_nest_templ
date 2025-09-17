import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AaaModule } from './aaa/aaa.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [AaaModule, RedisModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
