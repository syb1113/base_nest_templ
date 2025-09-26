import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD
<<<<<<< HEAD
import { AaaModule } from './aaa/aaa.module';
import { RedisModule } from './redis/redis.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [AaaModule, RedisModule, SessionModule],
=======
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
=======
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniqueCode } from './entities/UniqueCode';
import { UniqueCodeService } from './unique-code.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ShortLongMap } from './entities/ShortLongMap';
import { ShortLongMapService } from './short-long-map.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
>>>>>>> short_url_service
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'shiyibo',
<<<<<<< HEAD
      database: 'email_login_test',
      synchronize: true,
      logging: true,
      entities: [User],
=======
      database: 'short_url',
      synchronize: true,
      logging: true,
      entities: [UniqueCode, ShortLongMap],
>>>>>>> short_url_service
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
<<<<<<< HEAD
    EmailModule,
    RedisModule,
  ],
>>>>>>> email-login-backend
=======
  ],
>>>>>>> short_url_service
  controllers: [AppController],
  providers: [AppService, UniqueCodeService, ShortLongMapService],
})
export class AppModule {}
