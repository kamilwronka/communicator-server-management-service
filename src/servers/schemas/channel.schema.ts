import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, Types } from 'mongoose';

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
  _id?: string;

  @Prop()
  name: string;

  @Prop()
  type: ChannelType;

  @Transform(({ value }) => value.map((role) => role.toString()), {
    toPlainOnly: true,
  })
  @Prop()
  allowed_roles: Types.ObjectId[];
}

export const ServerChannelSchema = SchemaFactory.createForClass(Channel);
