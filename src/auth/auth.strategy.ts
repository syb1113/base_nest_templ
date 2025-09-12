import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: 'Ov23lisrDfrZrLPRBdkM',
      clientSecret: '29585d98e789de7d0566eb197fcac60f2da62081',
      callbackURL: 'http://localhost:3000/callback',
      scope: ['public_profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    return profile;
  }
}
