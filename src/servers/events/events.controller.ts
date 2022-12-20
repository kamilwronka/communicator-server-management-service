import { Controller, Get, UseInterceptors, Param } from '@nestjs/common';
import { CustomSerializerInterceptor } from '../../common/interceptors/custom-serializer.interceptor';
import { GetServerEventsParamsDto } from './dto/get-server-events.dto';
import { EventsService } from './events.service';
import { Event } from './schemas/event.schema';

@UseInterceptors(CustomSerializerInterceptor(Event))
@Controller(':serverId/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('')
  async getServerEvents(
    @Param() params: GetServerEventsParamsDto,
  ): Promise<Event[]> {
    return this.eventsService.getServerEvents(params.serverId);
  }
}
