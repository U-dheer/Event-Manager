import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { Repository } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateAttendeeDto } from './input/create-attendee.dto';
import { AttendeeAnswerEnum } from './attendee-answer.enum';

@Injectable()
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

  public async findOneByEventIdAndUserId(
    eventId: number,
    userId: number,
  ): Promise<Attendee | null> {
    return await this.attendeeRepository.findOneBy({
      event: { id: eventId },
      user: { id: userId },
    });
  }

  public async createOrUpdate(
    input: CreateAttendeeDto,
    eventId: number,
    userId: number,
  ): Promise<Attendee> {
    const attendee =
      (await this.findOneByEventIdAndUserId(eventId, userId)) ?? new Attendee();
    // Support numeric codes (1,2,3) mapping to string enum values.
    const mapAnswer = (ans: any): AttendeeAnswerEnum => {
      // numeric input (or numeric string)
      const n =
        typeof ans === 'string' && /^\d+$/.test(ans) ? Number(ans) : ans;
      if (typeof n === 'number') {
        switch (n) {
          case 1:
            return AttendeeAnswerEnum.Accepted;
          case 2:
            return AttendeeAnswerEnum.Maybe;
          case 3:
            return AttendeeAnswerEnum.Rejected;
          default:
            throw new BadRequestException('Invalid numeric answer');
        }
      }

      // if provided as one of the enum string values
      if (Object.values(AttendeeAnswerEnum).includes(n)) {
        return n as AttendeeAnswerEnum;
      }

      throw new BadRequestException('Invalid answer value');
    };

    attendee.answer = mapAnswer(input.answer);
    attendee.event = { id: eventId } as any;
    attendee.user = { id: userId } as any;

    return await this.attendeeRepository.save(attendee);
  }
}
