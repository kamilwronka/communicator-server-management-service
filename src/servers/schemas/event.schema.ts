import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';
import { EventDestination } from '../enums/event-destination.enum';

import { EventType } from '../enums/event-type.enum';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id?: string;

  @Prop()
  type: EventType;

  @Prop()
  destination: EventDestination;

  @Prop()
  id: string;

  @Prop()
  username: string;

  @Prop()
  profile_picture_url: string;
}

export const ServerEventSchema = SchemaFactory.createForClass(Event);
