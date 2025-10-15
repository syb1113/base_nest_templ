import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import {
  Between,
  EntityManager,
  FindOptionsWhere,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { Booking } from './entities/booking.entity';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class BookingService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  @InjectRepository(Booking)
  private repository: Repository<Booking>;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;
  async initData() {
    const user1 = await this.entityManager.findOneBy(User, {
      id: 1,
    });
    const user2 = await this.entityManager.findOneBy(User, {
      id: 2,
    });

    const room1 = await this.entityManager.findOneBy(MeetingRoom, {
      id: 'c5f0db9c-492a-4ca5-86b7-7ed993ba9e2b',
    });
    const room2 = await this.entityManager.findOneBy(MeetingRoom, {
      id: 'caa114b3-f464-49a2-8373-496cd53a2939',
    });

    const booking1 = new Booking();
    booking1.room = room1!;
    booking1.user = user1!;
    booking1.startTime = new Date();
    booking1.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking1);

    const booking2 = new Booking();
    booking2.room = room2!;
    booking2.user = user2!;
    booking2.startTime = new Date();
    booking2.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking2);

    const booking3 = new Booking();
    booking3.room = room1!;
    booking3.user = user2!;
    booking3.startTime = new Date();
    booking3.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking3);

    const booking4 = new Booking();
    booking4.room = room2!;
    booking4.user = user1!;
    booking4.startTime = new Date();
    booking4.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking4);
  }

  async find(
    pageNo: number | string,
    pageSize: number | string,
    username: string,
    meetingRoomName: string,
    meetingRoomPosition: string,
    bookingTimeRangeStart: number,
    bookingTimeRangeEnd: number,
  ) {
    pageNo = Number(pageNo);
    pageSize = Number(pageSize);
    if (pageNo < 1) {
      throw new BadRequestException('页码最小为 1');
    }
    const skipCount = (pageNo - 1) * pageSize;
    const condition: FindOptionsWhere<Booking> = {};

    if (username) {
      condition.user = {
        username: Like(`%${username}%`),
      };
    }

    if (meetingRoomName || meetingRoomPosition) {
      condition.room = {};
      if (meetingRoomName) {
        condition.room.name = Like(`%${meetingRoomName}%`);
      }
      if (meetingRoomPosition) {
        condition.room.location = Like(`%${meetingRoomPosition}%`);
      }
    }

    if (bookingTimeRangeStart) {
      if (!bookingTimeRangeEnd) {
        bookingTimeRangeEnd = bookingTimeRangeStart + 60 * 60 * 1000;
      }
      condition.startTime = Between(
        new Date(bookingTimeRangeStart),
        new Date(bookingTimeRangeEnd),
      );
    }

    const [bookings, totalCount] = await this.entityManager.findAndCount(
      Booking,
      {
        select: {
          id: true,
          startTime: true,
          user: {
            id: true,
            nickName: true,
          },
        },
        where: condition,
        relations: {
          user: true,
          room: true,
        },
        skip: skipCount,
        take: pageSize,
      },
    );
    return {
      bookings: bookings.map((item) => {
        const { nickName, email, phoneNumber, id } = item.user;
        return {
          ...item,
          user: { id, nickName, email, phoneNumber },
        };
      }),
      totalCount,
    };
  }
  async add(bookingDto: CreateBookingDto, userId: number) {
    const meetingRoom = await this.entityManager.findOneBy(MeetingRoom, {
      id: bookingDto.meetingRoomId,
    });

    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在');
    }
    const user = await this.entityManager.findOneBy(User, {
      id: userId,
    });
    const booking = new Booking();
    booking.room = meetingRoom;
    booking.user = user!;
    booking.startTime = new Date(bookingDto.startTime);
    booking.endTime = new Date(bookingDto.endTime);

    if (booking.startTime >= booking.endTime) {
      throw new BadRequestException('开始时间必须早于结束时间');
    }

    const res = await this.repository.findOne({
      where: {
        room: {
          id: bookingDto.meetingRoomId,
        },
        startTime: LessThanOrEqual(booking.endTime),
        endTime: MoreThanOrEqual(booking.startTime),
      },
    });
    console.log(res);

    if (res) {
      throw new BadRequestException('会议室已被占用');
    }

    await this.repository.save(booking);

    return 'success';
  }

  //通过预订
  async approve(id: string) {
    const booking = await this.repository.findOneBy({
      id,
    });

    if (!booking) {
      throw new BadRequestException('预订不存在');
    }

    booking.status = '审批通过';
    await this.repository.save(booking);

    return 'success';
  }

  //拒绝预订
  async reject(id: string) {
    const booking = await this.repository.findOneBy({
      id,
    });

    if (!booking) {
      throw new BadRequestException('预订不存在');
    }

    booking.status = '审批拒绝';
    await this.repository.save(booking);

    return 'success';
  }

  //解除预订
  async cancel(id: string) {
    const booking = await this.repository.findOneBy({
      id,
    });

    if (!booking) {
      throw new BadRequestException('预订不存在');
    }

    booking.status = '已解除';
    await this.repository.save(booking);

    return 'success';
  }

  //催办
  async urge(id: string) {
    const flag = await this.redisService.get('urge_' + id);
    if (flag) {
      throw new BadRequestException('半小时内只能催办一次，请耐心等待');
    }
    let email = await this.redisService.get('admin_email');

    if (!email) {
      const admin = await this.entityManager.findOne(User, {
        select: {
          email: true,
        },
        where: {
          isAdmin: true,
        },
      });
      if (!admin) {
        throw new BadRequestException('没有管理员');
      }

      email = admin.email;

      await this.redisService.set('admin_email', admin.email);
    }

    await this.emailService.sendMail({
      to: email,
      subject: '预定申请催办提醒',
      html: `id 为 ${id} 的预定申请正在等待审批`,
    });
    await this.redisService.set('urge_' + id, 60 * 30);
  }

  create(createBookingDto: CreateBookingDto) {
    console.log(createBookingDto);

    return 'This action adds a new booking';
  }

  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    console.log(updateBookingDto);
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
