import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, Types } from 'mongoose';

import { EPermissions } from '../enums/permissions.enum';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  constructor(partial: Partial<Role>) {
    Object.assign(this, partial);
  }

  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id?: Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ default: [] })
  permissions: EPermissions[];

  @Prop({ default: null })
  color: string;

  @Prop({ default: 0 })
  importance: number;
}

export const ServerRoleSchema = SchemaFactory.createForClass(Role);
