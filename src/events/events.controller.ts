import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  BadRequestException,
  ParseIntPipe,
  ValidationPipe,
  Logger,
  Inject,
  Query,
  UsePipes,
  UseGuards,
  ForbiddenException,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { EventsService } from './events.service';
import { ListEvnets } from './input/list-events';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGurdJwt } from 'src/auth/auth-guard.jwt';

@Controller('/events')
@SerializeOptions({
  strategy: 'excludeAll',
})
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  constructor(
    @Inject(EventsService)
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvnets) {
    const events =
      await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        { total: 1, currentPage: filter.page, limit: 3 },
      );

    return events?.data ?? [];
  }

  // @Get('/practise')
  // async practise() {
  //   // SELECT * FROM event WHERE (event.id > 3 AND event.when > '2021-02-12T13:00:00) OR event.description LIKE '%meet%
  //   return await this.repository.find({
  //     where: [
  //       { id: MoreThan(3), when: MoreThan(new Date('2021-02-12T13:00:00')) },
  //       {
  //         description: Like('%meet%'),
  //       },
  //     ],
  //   });
  // }

  // @Get('/practise2')
  // async practise2() {
  //   // return await this.repository.find({
  //   //   where: { id: 1 },
  //   //   relations: ['attendees'],
  //   // }); // to fetch relations eagerly

  //   const event = await this.repository.findOne({
  //     where: { id: 1 },
  //     relations: ['attendees'],
  //   });

  //   if (!event) {
  //     throw new NotFoundException(`Event with id 1 not found`);
  //   }

  //   const attendee = new Attendee();
  //   attendee.name = 'John Doe';    if (!event) {

  //   attendee.event = event;

  //   await this.attendeeRepository.save(attendee);

  //   return event;
  // }event

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsService.getEvent(id);
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  @Post()
  @UseGuards(AuthGurdJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    return await this.eventsService.createEvent(input, user);
  }

  @Patch(':id')
  @UseGuards(AuthGurdJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id') id: string,
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new BadRequestException(`Invalid id parameter: ${id}`);
    }
    const event = await this.eventsService.getEvent(numericId);

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        `You are not allowed to update this event`,
      );
    }

    return await this.eventsService.updateEvent(event, input);
  }

  @Delete(':id')
  @UseGuards(AuthGurdJwt)
  @HttpCode(204)
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    const events = await this.eventsService.getEvent(Number(id));
    if (!events) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    if (events.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        `You are not allowed to remove this event`,
      );
    }
    await this.eventsService.deleteEvent(Number(id));
  }
}
