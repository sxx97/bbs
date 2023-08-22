import { EventsXunfeiSocket } from './events.socket';
import { Module } from '@nestjs/common';

@Module({
  providers: [EventsXunfeiSocket],
})
export class XunfeiWebSocketModule {}
