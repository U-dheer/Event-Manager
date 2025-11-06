import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { AttendeesController } from './events-attendees.controller';
import { Event } from './event.entity';
import { Attendee } from './attendee.entity';
import { AppDummy } from './app.dummy';
import { EventsService } from './events.service';
import { AttendeesService } from './attendees.service';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';
import { EventsOrganizedbyUserController } from './events-organized-by-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [
    EventsController,
    AttendeesController,
    CurrentUserEventAttendanceController,
    EventsOrganizedbyUserController,
  ],
  providers: [EventsService, AttendeesService, AppDummy],
  exports: [EventsService, AttendeesService, AppDummy],
})
export class EventsModule {}
