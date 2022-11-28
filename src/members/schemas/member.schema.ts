import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { Document } from 'mongoose';

export type MemberDocument = Member & Document;

@Schema({ timestamps: true })
export class Member {
  @ApiProperty()
  @Transform((value) => value.obj._id.toString())
  _id: string;

  @ApiProperty()
  @Prop()
  userId: string;

  @ApiProperty()
  @Prop([{ type: String }])
  roles: string[];

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;

  @Exclude()
  __v: number;

  constructor(partial: Partial<Member>) {
    Object.assign(this, partial);
  }
}

export const MemberSchema = SchemaFactory.createForClass(Member);
