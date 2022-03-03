import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';

import { ChannelType } from '../enums/channelTypes.enum';

export type ChannelDocument = Channel & Document;

@Schema()
export class Channel {
  @Transform(
    ({ value }) => {
      return value.toString();
    },
    { toPlainOnly: true },
  )
  _id: string;

  @Prop()
  name: string;

  @Prop()
  type: ChannelType;

  @Prop()
  allowed_roles: string[];
}

export const ServerChannelSchema = SchemaFactory.createForClass(Channel);
