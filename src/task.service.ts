import { AaaService } from './aaa/aaa.service';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  @Inject()
  private aaaService: AaaService;
  @Cron(CronExpression.EVERY_5_SECONDS, {
    name: 'task1',
  })
  handleCron() {
    console.log('task execute', this.aaaService.findAll());
  }

  @Interval('task2', 500)
  task2() {
    console.log('task2');
  }

  @Timeout('task3', 3000)
  task3() {
    console.log('task3');
  }
}
