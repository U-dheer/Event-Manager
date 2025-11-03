import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

export class AttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  public async findByEventId(eventId: number): Promise<Attendee[]> {
    return await this.attendeeRepository.find({
      where: { event: { id: eventId } },
    });
  }
}
