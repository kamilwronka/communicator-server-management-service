import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ChannelType } from '../enums/channelTypes.enum';

@Schema()
export class Channel extends Document {
  @Prop()
  name: string;

  @Prop()
  type: ChannelType;

  @Prop()
  allowed_roles: string[];
}

export const ServerChannelSchema = SchemaFactory.createForClass(Channel);
