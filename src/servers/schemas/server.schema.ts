import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Ban, ServerBanSchema } from './ban.schema';
import { Channel, ServerChannelSchema } from './channel.schema';
import { Config, ServerConfigSchema } from './config.schema';
import { EventLog, ServerEventLogSchema } from './eventLog.schema';
import { Invitation, ServerInvitationSchema } from './invitation.schema';
import { Member, ServerMemberSchema } from './member.schema';
import { Role, ServerRoleSchema } from './role.schema';

@Schema({ timestamps: true })
export class Server extends Document {
  @Prop()
  name: string;

  @Prop()
  owner_id: string;

  @Prop({ type: [ServerChannelSchema], default: [] })
  channels: Channel[];

  @Prop({ type: [ServerRoleSchema], default: [] })
  roles: Role[];

  @Prop({ type: [ServerMemberSchema], default: [] })
  members: Member[];

  @Prop({ type: [ServerEventLogSchema], default: [] })
  event_log: EventLog[];

  @Prop({ type: [ServerBanSchema], default: [] })
  bans: Ban[];

  @Prop({ type: [ServerInvitationSchema], default: [] })
  invitations: Invitation[];

  @Prop({ type: ServerConfigSchema })
  config: Config;
}

export const ServerSchema = SchemaFactory.createForClass(Server);
