import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';

export type InvitationDocument = Invitation & Document;
@Schema()
export class Invitation {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: string;

  @Prop()
  user_id: string;

  @Prop()
  username: string;

  @Prop()
  profile_picture_url: string;
}

export const ServerInvitationSchema = SchemaFactory.createForClass(Invitation);
