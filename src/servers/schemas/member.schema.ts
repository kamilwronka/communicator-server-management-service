import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';

export type MemberDocument = Member & Document;
@Schema()
export class Member {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: string;

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
