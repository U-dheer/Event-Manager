import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendeeAnswerEnum } from './attendee-answer.enum';
import { ListEvnets, WhenEventFilter } from './input/list-events';
import { paginate, PaginateOptions } from 'src/pagination/paginator';
import { DeleteResult } from 'typeorm/browser';
import { CreateEventDto } from './input/create-event.dto';
import { User } from 'src/auth/user.entity';

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
    return this.getEventsBasedQuery()
      .loadRelationCountAndMap(
        'e.attendeeCount', //this maps the results to the property which is in the event entity
        'e.attendees', //this is relation name
      )
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendeeAccepted', // we need to parse this because we need to use query builder again
        (qb) =>
          qb.where(`attendeeAccepted.answer = ${AttendeeAnswerEnum.Accepted}`),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendeeMaybe', // we need to parse this because we need to use query builder again
        (qb) => qb.where(`attendeeMaybe.answer = ${AttendeeAnswerEnum.Maybe}`),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendees',
        'attendeeRejected',
        (qb) =>
          qb.where(`attendeeRejected.answer = ${AttendeeAnswerEnum.Rejected}`),
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

  public async createEvent(input: CreateEventDto, user: User): Promise<Event> {
    return await this.eventRepository.save({
      ...input,
      organizer: user,
      when: new Date(input.when),
    });
  }

  private async getEventsWithAttendeeCountFiltered(filter?: ListEvnets) {
    let query = this.getEventsWithAttendeesCountQuery();

    if (!filter) {
      return query;
    }

    if (filter.when) {
      if (filter.when == WhenEventFilter.Today) {
        query = query.andWhere(
          `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`,
        );
      }
    }

    if (filter.when) {
      if (filter.when == WhenEventFilter.Tomorrow) {
        query = query.andWhere(
          `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY`,
        );
      }
    }

    if (filter.when) {
      if (filter.when == WhenEventFilter.ThisWeek) {
        query = query.andWhere(`YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)`);
      }
    }

    if (filter.when) {
      if (filter.when == WhenEventFilter.NextWeek) {
        query = query.andWhere(
          `YEARWEEK(e.when, 1) = YEARWEEK(CURDATE() + 1 + 1)`,
        );
      }
    }

    return query;
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter?: ListEvnets,
    paginateOptions?: PaginateOptions,
  ) {
    return await paginate(
      await this.getEventsWithAttendeeCountFiltered(filter),
      paginateOptions,
    );
  }

  public async deleteEvent(id: number): Promise<DeleteResult> {
    return await this.eventRepository
      .createQueryBuilder('e')
      .delete()
      .where('id=:id', { id })
      .execute();
  }
}
