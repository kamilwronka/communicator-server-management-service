import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';
import { createHash } from 'crypto';

import { Permission } from '../enums/permission.enum';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, versionKey: 'version' })
export class Role {
  constructor(partial: Partial<Role>) {
    Object.assign(this, partial);
  }

  @Exclude()
  _id: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @Exclude()
  @Prop({ required: true, index: true })
  serverId: string;

  // @Exclude()
  @Prop({ default: [] })
  permissions: Permission[];

  @ApiProperty()
  @Prop({ default: null })
  color: string;

  @ApiProperty()
  @Prop({ default: 0 })
  importance: number;

  @Exclude()
  version: number;

  @Exclude()
  @Prop({ type: String, unique: true, trim: true })
  versionHash: string;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.pre('save', function (next) {
  this.increment();
  return next();
});

RoleSchema.pre('save', function (next) {
  const {
    id,
    name,
    serverId,
    permissions,
    color,
    importance,
    version,
    createdAt,
    updatedAt,
  } = this;
  this.versionHash = createHash('sha256')
    .update(
      JSON.stringify({
        id,
        name,
        serverId,
        permissions,
        color,
        importance,
        version,
        createdAt,
        updatedAt,
      }),
    )
    .digest('hex');
  return next();
});
