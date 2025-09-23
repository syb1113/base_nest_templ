import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { AaaModule } from './aaa/aaa.module';

@Module({
  imports: [ScheduleModule.forRoot(), AaaModule],
  controllers: [AppController],
  providers: [AppService, TaskService],
})
export class AppModule implements OnApplicationBootstrap {
  @Inject()
  private schedulerRegistry: SchedulerRegistry;
  onApplicationBootstrap() {
    const crons = this.schedulerRegistry.getCronJobs();

    crons.forEach((i, k) => {
      i.stop();
      this.schedulerRegistry.deleteCronJob(k);
    });

    const intervals = this.schedulerRegistry.getIntervals();
    intervals.forEach((i) => {
      const interval = this.schedulerRegistry.getInterval(i) as NodeJS.Timeout;
      clearInterval(interval);
      this.schedulerRegistry.deleteInterval(i);
    });

    const timeouts = this.schedulerRegistry.getTimeouts();
    timeouts.forEach((i) => {
      const timeout = this.schedulerRegistry.getTimeout(i) as NodeJS.Timeout;
      clearTimeout(timeout);
      this.schedulerRegistry.deleteTimeout(i);
    });
  }
}
