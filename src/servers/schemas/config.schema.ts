import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Config extends Document {
  @Prop()
  server_image_url: string;
}

export const ServerConfigSchema = SchemaFactory.createForClass(Config);
