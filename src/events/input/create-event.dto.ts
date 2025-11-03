import { IsDate, IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDto {
  @IsString({ message: 'Name must be a string' })
  @Length(5, 255, { message: 'Name must be between 5 and 255 characters long' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @Length(5, 255, {
    message: 'Description must be between 5 and 255 characters long',
  })
  description: string;

  @IsDateString({}, { message: 'When must be a valid date' })
  when: string;

  @Length(5, 255)
  address: string;
}
