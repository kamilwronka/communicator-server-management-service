import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { Document } from 'mongoose';

export type InviterDocument = Inviter & Document;
export type InviteDocument = Invite & Document;

@Schema({ _id: false })
export class Server {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  server_image_url?: string;
}

@Schema({ _id: false })
export class Inviter {
  @Prop()
  user_id: string;

  @Prop()
  username: string;

  @Prop()
  profile_picture_url: string;
}

@Schema({ timestamps: true })
export class Invite {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id?: string;

  createdAt?: string;

  updatedAt?: string;

  @Prop()
  max_age: number;

  @Prop()
  max_uses: number;

  @Type(() => Server)
  @Prop({ type: Server })
  server: Server;

  @Type(() => Inviter)
  @Prop({ type: Inviter })
  inviter: Inviter;
}

export const ServerInviteSchema = SchemaFactory.createForClass(Invite);
