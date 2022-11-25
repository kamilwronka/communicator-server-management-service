import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, Types } from 'mongoose';

export type MemberDocument = Member & Document;
@Schema({ _id: false })
export class Member {
  @Prop()
  id: string;

  @Prop()
  username: string;

  @Prop()
  profile_picture_url: string;

  @Transform(({ value }) => value.map((role) => role.toString()), {
    toPlainOnly: true,
  })
  @Prop()
  roles: Types.ObjectId[];
}

export const ServerMemberSchema = SchemaFactory.createForClass(Member);
