import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AttendeeAnswerEnum } from './attendee-answer.enum';
import { Event } from './event.entity';
import { Expose } from 'class-transformer';
import { User } from 'src/auth/user.entity';

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Expose()
  @Column()
  name: string;

  @ManyToOne(() => Event, (event) => event.attendees, {
    nullable: false,
  })
  @JoinColumn()
  event: Event;

  @Column()
  eventId: number;

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted,
  })
  @Expose()
  answer: AttendeeAnswerEnum;

  @ManyToOne(() => User, (user) => user.attended)
  user: User;

  @Column()
  userId: number;
}
