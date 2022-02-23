import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { EventLogDestination } from '../enums/eventLogDestination.enum';
import { EventLogType } from '../enums/eventLogType.enum';

@Schema()
export class EventLog extends Document {
  @Prop()
  type: EventLogType[];

  @Prop()
  destination: EventLogDestination[];

  @Prop()
  user_id: string;

  @Prop()
  username: string;

  @Prop()
  profile_picture_url: string;
}

export const ServerEventLogSchema = SchemaFactory.createForClass(EventLog);
