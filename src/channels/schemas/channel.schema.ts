import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { Document } from 'mongoose';
import { User } from '../dto/create-channel.dto';

import { ChannelType } from '../enums/channelTypes.enum';
import {
  PermissionOverwrite,
  PermissionOverwriteSchema,
} from './permission-overwrite.schema';

export type ChannelDocument = Channel & Document;

@Schema({ timestamps: true })
export class Channel {
  @Transform(
    ({ value }) => {
      return value.toString();
    },
    { toPlainOnly: true },
  )
  _id?: string;

  @Prop({ required: false, default: undefined })
  name: string;

  @Prop({ required: false, default: undefined })
  server_id?: string;

  @Prop({ required: false })
  parent_id?: string;

  @Prop()
  type: ChannelType;

  @Prop({ type: [], default: undefined })
  users?: User[];

  @Type(() => PermissionOverwrite)
  @Prop({ type: [PermissionOverwriteSchema], default: [] })
  permissions_overwrites?: PermissionOverwrite[];
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
