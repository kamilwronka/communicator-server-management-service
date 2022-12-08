import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';

export type MemberDocument = Member & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Member {
  @Exclude()
  _id: string;

  @ApiProperty()
  @Prop({ type: String })
  userId: string;

  @Exclude()
  @Prop({ type: String })
  serverId: string;

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
