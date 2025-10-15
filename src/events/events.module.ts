import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { AppDummy } from './app.dummy';

@Module({
    imports:[
        TypeOrmModule.forFeature([Event])
    ],
    controllers:[EventsController],
    providers: [AppDummy],
    exports: [AppDummy],
})
export class EventsModule {}
