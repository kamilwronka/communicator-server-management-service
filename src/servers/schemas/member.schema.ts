import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Member extends Document {
  @Prop()
  user_id: string;

  @Prop()
  username: string;

  @Prop()
  profile_picture_url: string;

  @Prop()
  roles: string[];
}

export const ServerMemberSchema = SchemaFactory.createForClass(Member);
