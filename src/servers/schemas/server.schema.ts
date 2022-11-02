import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { Document } from 'mongoose';
import { Ban, ServerBanSchema } from './ban.schema';
import { EventLog, ServerEventLogSchema } from './eventLog.schema';
import { Member, ServerMemberSchema } from './member.schema';
import { Role, ServerRoleSchema } from '../roles/schemas/role.schema';

export type ServerDocument = Server & Document;

@Schema({ timestamps: true })
export class Server {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id?: string;

  @Prop()
  name: string;

  @Prop({ default: null })
  icon: string | null;

  @Prop()
  owner_id: string;

  @Type(() => Role)
  @Prop({ type: [ServerRoleSchema], default: [] })
  roles: Role[];

  @Type(() => Member)
  @Prop({ type: [ServerMemberSchema], default: [] })
  members: Member[];

  @Type(() => EventLog)
  @Exclude()
  @Prop({ type: [ServerEventLogSchema], default: [] })
  event_log: EventLog[];

  @Type(() => Ban)
  @Exclude()
  @Prop({ type: [ServerBanSchema], default: [] })
  bans: Ban[];

  constructor(partial: Partial<Server>) {
    Object.assign(this, partial);
  }
}

export const ServerSchema = SchemaFactory.createForClass(Server);
