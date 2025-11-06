import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { AttendeesService } from './attendees.service';
import { CreateAttendeeDto } from './input/create-attendee.dto';
import { User } from 'src/auth/user.entity';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthGurdJwt } from 'src/auth/auth-guard.jwt';

@Controller('/events-attendance')
@SerializeOptions({
  strategy: 'excludeAll',
})
export class CurrentUserEventAttendanceController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly attendeesService: AttendeesService,
  ) {}

  @Get()
  @UseGuards(AuthGurdJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @CurrentUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
  ) {
    return await this.eventsService.getEventsAttendedByUserIdPaginated(
      user.id,
      { currentPage: page, limit: 3 },
    );
  }

  @Get(':eventId')
  @UseGuards(AuthGurdJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ) {
    const attendee = await this.attendeesService.findOneByEventIdAndUserId(
      eventId,
      user.id,
    );

    if (!attendee) {
      throw new NotFoundException();
    }
    return attendee;
  }

  @Put('/:eventId')
  @UseGuards(AuthGurdJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async createOrUpdate(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() input: CreateAttendeeDto,
    @CurrentUser() user: User,
  ) {
    return this.attendeesService.createOrUpdate(input, eventId, user.id);
  }
}
