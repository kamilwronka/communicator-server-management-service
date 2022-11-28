import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { Document } from 'mongoose';

import { Permissions } from '../enums/permissions.enum';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  constructor(partial: Partial<Role>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @Transform((value) => value.obj._id.toString())
  _id: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ default: [] })
  permissions: Permissions[];

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
