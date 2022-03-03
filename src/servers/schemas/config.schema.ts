import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';

export type ConfigDocument = Config & Document;
@Schema()
export class Config {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: string;

  @Prop()
  server_image_url: string;
}

export const ServerConfigSchema = SchemaFactory.createForClass(Config);
