import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';

import { Permissions } from '../enums/permissions.enum';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: string;

  @Prop()
  name: string;

  @Prop()
  permissions: Permissions[];

  @Prop()
  color: string;

  @Prop()
  importance: number;
}

export const ServerRoleSchema = SchemaFactory.createForClass(Role);
