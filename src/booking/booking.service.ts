import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Between, EntityManager, FindOptionsWhere, Like } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService {
  @InjectEntityManager()
  private entityManager: EntityManager;

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
