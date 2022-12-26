import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { createHash } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { User } from '../../../users/schemas/user.schema';
import { Role } from '../../roles/schemas/role.schema';

export type MemberDocument = HydratedDocument<Member>;

@Schema({ timestamps: true, toJSON: { virtuals: true }, versionKey: 'version' })
export class Member {
  @Exclude()
  _id: string;

  @ApiProperty()
  id: string;

  @Exclude()
  @Prop({
    type: String,
    required: true,
    immutable: true,
    unique: false,
    trim: true,
  })
  userId: string;

  @Type(() => User)
  user: User;

  @Exclude()
  @Prop({
    type: String,
    required: true,
    immutable: true,
    unique: false,
    trim: true,
  })
  serverId: string;

  @Exclude()
  @Prop([{ type: String }])
  roleIds: string[];

  @ApiProperty()
  @Type(() => Role)
  roles: Role[];

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;

  @Exclude()
  version: number;

  @Exclude()
  @Prop({ type: String, unique: true, trim: true })
  versionHash: string;

  constructor(partial: Partial<Member>) {
    Object.assign(this, partial);
  }
}

export const MemberSchema = SchemaFactory.createForClass(Member);

MemberSchema.index(
  { userId: 1, serverId: 1 },
  { unique: true, name: 'userId_serverId' },
);

MemberSchema.virtual('user', {
  ref: User.name,
  localField: 'userId',
  foreignField: 'userId',
  justOne: true,
});

MemberSchema.virtual('roles', {
  ref: Role.name,
  localField: 'roleIds',
  foreignField: '_id',
});

MemberSchema.pre('save', function (next) {
  const { id, userId, serverId, roleIds, version, createdAt, updatedAt } = this;
  this.versionHash = createHash('sha256')
    .update(
      JSON.stringify({
        id,
        userId,
        roleIds,
        serverId,
        version,
        createdAt,
        updatedAt,
      }),
    )
    .digest('hex');
  return next();
});
