export enum EChannelType {
  VOICE = 'VOICE',
  TEXT = 'TEXT',
  PARENT = 'PARENT',
}

export type TCreateServerChannelRequestBody = {
  name: string;
  parentId?: string;
  type: EChannelType;
};

export type TChannel = {
  _id: string;
  name: string;
  serverId: string;
  type: EChannelType;
};

export type TGetRTCTokenResponse = {
  token: string;
};
