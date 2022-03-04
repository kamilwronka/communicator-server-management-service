import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';

import { EventLogDestination } from '../enums/eventLogDestination.enum';
import { EventLogType } from '../enums/eventLogType.enum';

export type EventLogDocument = EventLog & Document;

@Schema()
export class EventLog {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id?: string;

  @Prop()
  type: EventLogType;

  @Prop()
  destination: EventLogDestination;

  @Prop()
  user_id: string;

  @Prop()
  username: string;

  @Prop()
  profile_picture_url: string;
}

export const ServerEventLogSchema = SchemaFactory.createForClass(EventLog);
