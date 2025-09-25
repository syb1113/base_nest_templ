import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { generateRandomStr } from './utils';
import { UniqueCode } from './entities/UniqueCode';
// import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UniqueCodeService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  // @Cron(CronExpression.EVERY_5_SECONDS)
  async generateCode(): Promise<any> {
    const str = generateRandomStr(8);

    const uniqueCode = await this.entityManager.findOne(UniqueCode, {
      where: {
        code: str,
      },
    });

    if (!uniqueCode) {
      const code = new UniqueCode();
      code.code = str;
      code.status = 0;

      return await this.entityManager.insert(UniqueCode, code);
    }

    return this.generateCode();
  }
}
