import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PermissionType } from '../enums/permission-type.enum';

export type PermissionOverwriteDocument = PermissionOverwrite & Document;

@Schema({ _id: false })
export class PermissionOverwrite {
  @Prop({ required: true })
  allow: boolean;

  @Prop({ required: true })
  type: PermissionType;

  @Prop({ required: true })
  id: string;
}

export const PermissionOverwriteSchema =
  SchemaFactory.createForClass(PermissionOverwrite);
