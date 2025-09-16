import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { SessionService } from './session/session.service';
import type { Request, Response } from 'express';
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
}
