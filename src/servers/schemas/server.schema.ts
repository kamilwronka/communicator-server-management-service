import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Type } from 'class-transformer';
import { Document } from 'mongoose';
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
  __v: number;

  constructor(partial: Partial<Server>) {
    Object.assign(this, partial);
  }
}

export const ServerSchema = SchemaFactory.createForClass(Server);
