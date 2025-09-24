import { Inject, Injectable } from '@nestjs/common';
import { CreateAaaDto } from './dto/create-aaa.dto';
import { UpdateAaaDto } from './dto/update-aaa.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AaaService {
  create(createAaaDto: CreateAaaDto) {
    return 'This action adds a new aaa';
  }

  @Inject()
  private eventEmmitter: EventEmitter2;
  findAll() {
    this.eventEmmitter.emit('aaa.find', {
      data: 'aaa.find',
    });
    this.eventEmmitter.emit('aaa.find1', {
      data: 'aaa.find1',
    });
    this.eventEmmitter.emit('aaa.find2', {
      data: 'aaa.find2',
    });
    return `This action returns all aaa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aaa`;
  }

  update(id: number, updateAaaDto: UpdateAaaDto) {
    return `This action updates a #${id} aaa`;
  }

  remove(id: number) {
    return `This action removes a #${id} aaa`;
  }
}
