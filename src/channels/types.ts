export enum ChannelType {
  VOICE = 'VOICE',
  TEXT = 'TEXT',
  PARENT = 'PARENT',
}

export type CreateServerChannelRequestBody = {
  name: string;
  parentId?: string;
  type: ChannelType;
};

export type Channel = {
  _id: string;
  name: string;
  serverId: string;
  type: ChannelType;
};

export type GetRTCTokenResponse = {
  token: string;
};
