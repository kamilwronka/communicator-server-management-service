import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';

export type BanDocument = Ban & Document;

@Schema()
export class Ban {
  @Transform(
    ({ value }) => {
      return value.toString();
    },
    { toPlainOnly: true },
  )
  _id: string;

  @Prop()
  user_id: string;

  @Prop()
  username: string;

  @Prop()
  profile_picture_url: string;
}

export const ServerBanSchema = SchemaFactory.createForClass(Ban);
