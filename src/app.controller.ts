import { RedisService } from 'src/redis/redis.service';
import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Body,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
export class CccDto {
  aaa: string;
  bbb: number;
  ccc: Array<string>;
}
export class CccVo {
  aaa: number;
  bbb: number;
declare module 'express' {
  interface Request {
    cookies: {
      sid: string;
    };
  }
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(SessionService)
  private sessionService: SessionService;

  @Get('count')
  async count(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sid = req.cookies?.sid;

    const session = await this.sessionService.getSession<{ count: string }>(
      sid,
    );

    const curCount = session.count ? parseInt(session.count) + 1 : 1;
    const curSid = await this.sessionService.setSession(sid, {
      count: curCount,
    });

    res.cookie('sid', curSid, {
      maxAge: 1800000,
    });

    return curCount;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @ApiOperation({ summary: '测试 aaa', description: 'aaa 描述' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'aaa 成功',
    type: String,
  })
  @ApiQuery({
    name: 'a1',
    type: String,
    description: 'a1 param',
    required: false,
    example: '1111',
  })
  @ApiQuery({
    name: 'a2',
    type: Number,
    description: 'a2 param',
    required: true,
    example: 2222,
  })
  @Get('aaa')
  aaa(@Query('a1') a1, @Query('a2') a2) {
    console.log(a1, a2);
    return 'aaa success';
  }
  @ApiOperation({ summary: '测试 bbb', description: 'bbb 描述' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'bbb 成功',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'id 不合法',
  })
  @ApiParam({
    name: 'id',
    description: 'ID',
    required: true,
    example: 222,
  })
  @Get('bbb/:id')
  bbb(@Param('id') id) {
    console.log(id);
    return 'bbb success';
  }

  @Post('ccc')
  ccc(@Body('ccc') ccc: CccDto) {
    console.log(ccc);

    const vo = new CccVo();
    vo.aaa = 111;
    vo.bbb = 222;
    return vo;

  @Sse('stream')
  stream() {
    return new Observable((observer) => {
      observer.next({ data: { msg: 'aaa' } });

      setTimeout(() => {
        observer.next({ data: { msg: 'bbb' } });
      }, 2000);

      setTimeout(() => {
        observer.next({ data: { msg: 'ccc' } });
      }, 5000);
    });
  }
  @Sse('stream2')
  stream2() {
    const childProcess = exec('tail -f ./log');

    return new Observable((observer) => {
      childProcess.stdout!.on('data', (msg: string | Buffer) => {
        observer.next({ data: { msg: msg.toString() } });
      });
    });
  }
  @Sse('stream3')
  stream3() {
    return new Observable((observer) => {
      const json = readFileSync('./package.json').toJSON();
      observer.next({ data: { msg: json } });
    });
  }
}
