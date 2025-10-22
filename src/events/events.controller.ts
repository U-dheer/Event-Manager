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
  Put,
  BadRequestException,
  ParseIntPipe,
  ValidationPipe,
  Logger,
  Inject,
  Query,
} from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, MoreThan, Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { ListEvnets } from './input/list-events';
import { filter } from 'rxjs';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    @Inject(EventsService)
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  async findAll(@Query() filter: ListEvnets) {
    this.logger.log('Fetching all events');
    const events =
      await this.eventsService.getEventsWithAttendeeCountFiltered(filter);
    this.logger.debug(`Found ${events.length} events`);
    return events;
  }

  @Get('/practise')
  async practise() {
    // SELECT * FROM event WHERE (event.id > 3 AND event.when > '2021-02-12T13:00:00) OR event.description LIKE '%meet%
    return await this.repository.find({
      where: [
        { id: MoreThan(3), when: MoreThan(new Date('2021-02-12T13:00:00')) },
        {
          description: Like('%meet%'),
        },
      ],
    });
  }

  @Get('/practise2')
  async practise2() {
    // return await this.repository.find({
    //   where: { id: 1 },
    //   relations: ['attendees'],
    // }); // to fetch relations eagerly

    const event = await this.repository.findOne({
      where: { id: 1 },
      relations: ['attendees'],
    });

    if (!event) {
      throw new NotFoundException(`Event with id 1 not found`);
    }

    const attendee = new Attendee();
    attendee.name = 'John Doe';
    attendee.event = event;

    await this.attendeeRepository.save(attendee);

    return event;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsService.getEvent(id);
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() input: UpdateEventDto) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new BadRequestException(`Invalid id parameter: ${id}`);
    }
    const event = await this.repository.findOneBy({ id: numericId });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new BadRequestException(`Invalid id parameter: ${id}`);
    }
    const event = await this.repository.findOneBy({ id: numericId });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    await this.repository.remove(event);
  }
}
