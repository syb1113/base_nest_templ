import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  Put,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Get('list')
  async list(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('pageSize', new DefaultValuePipe(2)) pageSize: number,
    @Query('name') name: string,
    @Query('capacity') capacity: number,
    @Query('equipment') equipment: string,
  ) {
    return await this.meetingRoomService.find(
      page,
      pageSize,
      name,
      capacity,
      equipment,
    );
  }
  @Post('create')
  async create(@Body() meetingRoomDto: CreateMeetingRoomDto) {
    return await this.meetingRoomService.create(meetingRoomDto);
  }
  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() meetingRoomDto: UpdateMeetingRoomDto,
  ) {
    return await this.meetingRoomService.update(id, meetingRoomDto);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.meetingRoomService.findOne(id);
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.meetingRoomService.delete(id);
  }

  @Post('')
  @Get()
  findAll() {
    return this.meetingRoomService.findAll();
  }
}
