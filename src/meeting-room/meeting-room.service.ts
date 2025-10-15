import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private repository: Repository<MeetingRoom>;

  async initData() {
    const room1 = new MeetingRoom();
    room1.name = '木星';
    room1.capacity = 10;
    room1.equipment = '白板';
    room1.location = '一层西';

    const room2 = new MeetingRoom();
    room2.name = '金星';
    room2.capacity = 5;
    room2.equipment = '';
    room2.location = '二层东';

    const room3 = new MeetingRoom();
    room3.name = '天王星';
    room3.capacity = 30;
    room3.equipment = '白板，电视';
    room3.location = '三层东';

    await this.repository.insert([room1, room2, room3]);
  }
  async find(
    pageNo: number,
    pageSize: number,
    name: string,
    capacity: number,
    equipment: string,
  ) {
    if (pageNo < 1) {
      throw new BadRequestException('页码最小为 1');
    }
    const skipCount = (pageNo - 1) * pageSize;
    const condition: Record<string, any> = {};
    if (name) {
      condition.name = Like(`%${name}%`);
    }
    if (equipment) {
      condition.equipment = Like(`%${equipment}%`);
    }
    if (capacity) {
      condition.capacity = capacity;
    }
    const [meetingRooms, totalCount] = await this.repository.findAndCount({
      skip: skipCount,
      take: pageSize,
      where: condition,
    });
    return {
      meetingRooms,
      totalCount,
    };
  }

  async create(createMeetingRoomDto: CreateMeetingRoomDto) {
    const room = await this.repository.findOneBy({
      name: createMeetingRoomDto.name,
    });

    if (room) {
      throw new BadRequestException('会议室名字已存在');
    }
    return await this.repository.save(createMeetingRoomDto);
  }
  async update(id: string, updateMeetingRoomDto: UpdateMeetingRoomDto) {
    const meetingRoom = await this.repository.findOneBy({
      id,
    });

    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在');
    }

    meetingRoom.capacity = updateMeetingRoomDto.capacity!;
    meetingRoom.location = updateMeetingRoomDto.location!;
    meetingRoom.name = updateMeetingRoomDto.name!;

    if (updateMeetingRoomDto.description) {
      meetingRoom.description = updateMeetingRoomDto.description;
    }
    if (updateMeetingRoomDto.equipment) {
      meetingRoom.equipment = updateMeetingRoomDto.equipment;
    }
    await this.repository.update(id, meetingRoom);

    return 'success';
  }

  async findOne(id: string) {
    const meetingRoom = await this.repository.findOneBy({ id });
    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在');
    }
    return meetingRoom;
  }

  async delete(id: string) {
    // const bookings = await this.entityManager.findBy(Booking, {
    //   room: {
    //     id: id,
    //   },
    // });

    // for (let i = 0; i < bookings.length; i++) {
    //   this.entityManager.delete(Booking, bookings[i].id);
    // }
    const meetingRoom = await this.repository.findOneBy({ id });
    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在');
    }
    await this.repository.delete(id);
    return 'success';
  }

  findAll() {
    return `This action returns all meetingRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} meetingRoom`;
  }
}
