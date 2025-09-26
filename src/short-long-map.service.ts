import { UniqueCodeService } from './unique-code.service';
import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ShortLongMap } from './entities/ShortLongMap';
import { UniqueCode } from './entities/UniqueCode';

@Injectable()
export class ShortLongMapService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  @Inject(UniqueCodeService)
  private uniqueCodeService: UniqueCodeService;

  async getLongUrl(shortUrl: string) {
    const shortLongMap = await this.entityManager.findOne(ShortLongMap, {
      where: { shortUrl },
    });
    if (!shortLongMap) {
      return null;
    }
    return shortLongMap.longUrl;
  }
  async generate(longUrl: string) {
    let uniqueCode = await this.entityManager.findOneBy(UniqueCode, {
      status: 0,
    });

    if (!uniqueCode) {
      uniqueCode = (await this.uniqueCodeService.generateCode()) as UniqueCode;
    }
    const map = new ShortLongMap();
    map.shortUrl = uniqueCode.code;
    map.longUrl = longUrl;

    await this.entityManager.insert(ShortLongMap, map);
    await this.entityManager.update(
      UniqueCode,
      {
        id: uniqueCode.id,
      },
      {
        status: 1,
      },
    );
    return uniqueCode.code;
  }
}
