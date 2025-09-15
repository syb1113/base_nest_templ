import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: '你的客户端ID',
      clientSecret: '你的客户端密钥',
      callbackURL: '你的回调地址',
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { name, emails, photos } = profile;
    console.log(profile);

    const user = {
      email: emails?.[0]?.value ?? '',
      firstName: name?.givenName ?? '',
      lastName: name?.familyName ?? '',
      picture: photos?.[0]?.value ?? '',
      accessToken,
    };
    return user;
  }
}
