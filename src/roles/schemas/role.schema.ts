import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';

import { Permission } from '../enums/permission.enum';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Role {
  constructor(partial: Partial<Role>) {
    Object.assign(this, partial);
  }

  @Exclude()
  _id: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, index: true })
  serverId: string;

  @ApiProperty()
  @Prop({ default: [] })
  permissions: Permission[];

  @ApiProperty()
  @Prop({ default: null })
  color: string;

  @ApiProperty()
  @Prop({ default: 0 })
  importance: number;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;

  @Exclude()
  __v: number;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.pre('save', function (next) {
  this.increment();
  return next();
});
