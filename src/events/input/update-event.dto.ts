import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from '../input/create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  when: any;
}

// by default the PartialType will make all the fields optional
