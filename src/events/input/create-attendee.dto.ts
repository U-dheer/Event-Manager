import { IsIn } from 'class-validator';
import { AttendeeAnswerEnum } from '../attendee-answer.enum';

// Accept either numeric code (1/2/3) or the string enum values ('Accepted', 'Maybe', 'Rejected')
export class CreateAttendeeDto {
  @IsIn([
    1,
    2,
    3,
    AttendeeAnswerEnum.Accepted,
    AttendeeAnswerEnum.Maybe,
    AttendeeAnswerEnum.Rejected,
  ])
  answer: number | AttendeeAnswerEnum;
}
