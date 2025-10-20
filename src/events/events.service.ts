import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  private getEventsBasedQuery() {
    return this.eventRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  public getEventsWithAttendeesCountQuery() {
    return this.getEventsBasedQuery().loadRelationCountAndMap(
      'e.attendeeCount', //this maps the results to the property which is in the event entity
      'e.attendees', //this is relation name
    );
  }

  public async getEvent(id: number): Promise<Event | null> {
    const query = this.getEventsWithAttendeesCountQuery().andWhere(
      'e.id = :id',
      { id },
    );

    this.logger.debug(query.getSql());

    return await query.getOne();
  }
}
