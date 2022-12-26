import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Type } from 'class-transformer';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/schemas/role.schema';
import { createHash } from 'crypto';

export type ServerDocument = Server & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, versionKey: 'version' })
export class Server {
  @Exclude()
  _id?: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop({ default: null })
  icon: string | null;

  @Exclude()
  @Prop()
  ownerId: string;

  @Exclude()
  @Prop([{ type: String }])
  @Type(() => Role)
  members: string[];

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;

  @Exclude()
  version: number;

  @Exclude()
  @Prop({ type: String, unique: true, trim: true })
  versionHash: string;

  constructor(partial: Partial<Server>) {
    Object.assign(this, partial);
  }
}

export const ServerSchema = SchemaFactory.createForClass(Server);

ServerSchema.pre('save', function (next) {
  const { id, name, icon, ownerId, members, createdAt, updatedAt, version } =
    this;
  this.versionHash = createHash('sha256')
    .update(
      JSON.stringify({
        id,
        name,
        icon,
        ownerId,
        members,
        version,
        createdAt,
        updatedAt,
      }),
    )
    .digest('hex');
  return next();
});
