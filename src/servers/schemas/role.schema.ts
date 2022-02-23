import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Permissions } from '../enums/permissions.enum';

@Schema()
export class Role extends Document {
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
