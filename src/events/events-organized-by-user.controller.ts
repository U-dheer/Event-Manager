import {
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './event.entity';

@Controller('/events-organized-by-user/:userId')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsOrganizedbyUserController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return await this.eventsService.getEventsOrganizedByUserIdPaginated(
      userId,
      {
        currentPage: page,
        limit: 5,
      },
    );
  }
}
