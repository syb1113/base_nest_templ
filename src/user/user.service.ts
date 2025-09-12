import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly users = [
    {
      userId: 1,
      username: 'zhangsan',
      password: 'zhangsan',
    },
    {
      userId: 2,
      username: 'lisi',
      password: 'lisi',
    },
  ];

  findOne(username: string) {
    return this.users.find((user) => user.username === username);
  }
}
