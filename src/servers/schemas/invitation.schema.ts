import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Invitation extends Document {
  @Prop()
  user_id: string;

  @Prop()
  username: string;

  @Prop()
  profile_picture_url: string;
}

export const ServerInvitationSchema = SchemaFactory.createForClass(Invitation);
