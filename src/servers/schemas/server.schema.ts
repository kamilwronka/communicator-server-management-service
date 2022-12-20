import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Type } from 'class-transformer';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Ban, ServerBanSchema } from './ban.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/schemas/role.schema';

export type ServerDocument = Server & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
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
  owner_id: string;

  @Exclude()
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: Role.name }])
  @Type(() => Role)
  roles: Role[];

  @ApiProperty()
  @Type(() => Ban)
  @Exclude()
  @Prop({ type: [ServerBanSchema], default: [] })
  bans: Ban[];

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;

  @Exclude()
  __v: number;

  constructor(partial: Partial<Server>) {
    Object.assign(this, partial);
  }
}

export const ServerSchema = SchemaFactory.createForClass(Server);
