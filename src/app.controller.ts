import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

interface JwtUserData {
  id: string;
}
declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('login')
  @UseGuards(AuthGuard('github'))
  login(@Req() req: Request) {}

  @Get('callback')
  @UseGuards(AuthGuard('github'))
  authCallback(@Req() req: Request) {
    return this.appService.findUserByGithubId(req.user.id);
  }
}
