import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Ban, ServerBanSchema } from './ban.schema';
import { Event, ServerEventSchema } from './event.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/roles/schemas/role.schema';
import { Member } from 'src/members/schemas/member.schema';

export type ServerDocument = Server & Document;

@Schema({ timestamps: true })
export class Server {
  @ApiProperty()
  @Transform((value) => value.obj._id.toString())
  _id?: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop({ default: null })
  icon: string | null;

  @Exclude()
  @Prop()
  owner_id: string;

  @ApiProperty({ isArray: true, type: Role })
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: Role.name }])
  @Type(() => Role)
  roles: Role[];

  @ApiProperty({ isArray: true, type: Member })
  @Type(() => Member)
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: Member.name }])
  members: Member[];

  @ApiProperty()
  @Type(() => Event)
  @Exclude()
  @Prop({ type: [ServerEventSchema], default: [] })
  events: Event[];

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
