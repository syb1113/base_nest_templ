import { Injectable } from '@nestjs/common';

const users = [
  {
    username: 'syb1113',
    githubId: '135093765',
    email: 'yyy@163.com',
    hobbies: ['sleep', 'writting'],
  },
  {
    username: 'dongdong',
    email: 'xxx@xx.com',
    hobbies: ['swimming'],
  },
];

@Injectable()
export class AppService {
  findUserByGithubId(githubId: string) {
    return users.find((item) => item.githubId === githubId);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
