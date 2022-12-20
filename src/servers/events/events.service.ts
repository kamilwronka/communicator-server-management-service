import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventRepository: Model<EventDocument>,
  ) {}

  async getServerEvents(serverId: string): Promise<Event[]> {
    const events = await this.eventRepository.find({ serverId });

    return events;
  }

  async logServerEvent(eventData: Partial<Event>): Promise<Event> {
    const event = new this.eventRepository(eventData);

    return event.save();
  }
}
