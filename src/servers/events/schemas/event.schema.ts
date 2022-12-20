import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';
import { User } from '../../../users/schemas/user.schema';
import { EventDestination } from '../enums/event-destination.enum';

import { EventType } from '../enums/event-type.enum';

export type EventDocument = Event & Document;

@Schema({ toJSON: { virtuals: true }, id: false, timestamps: true })
export class Event {
  @Exclude()
  _id: string;

  @Prop({ type: String })
  serverId: string;

  @Prop({ type: String })
  type: EventType;

  @Prop({ type: String })
  destination: EventDestination;

  @Prop({ type: String })
  userId: string;

  user: User;

  createdAt: string;
  updatedAt: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.virtual('user', {
  ref: User.name,
  localField: 'userId',
  foreignField: 'userId',
  justOne: true,
});
