import { Logger } from '@nestjs/common';
import { mockServerClient } from 'mockserver-client';
import { createServerInviteMock } from './invites/create-invite-response.mock';
import { deleteInviteMock } from './invites/delete-invite-response.mock';
import { getInviteByIdMock } from './invites/get-invite-by-id-response.mock';
import { getServerInvitesMock } from './invites/get-server-invites-response.mock';
import { getUserByIdMock } from './users/get-user-by-id.mock';

export const configureMockserver = async () => {
  const mocks = [
    createServerInviteMock,
    deleteInviteMock,
    getServerInvitesMock,
    getInviteByIdMock,
    getUserByIdMock,
  ];

  await Promise.all(
    mocks.map((mock) => {
      mockServerClient('mockserver', 1080).mockAnyResponse(mock);
    }),
  );
  Logger.log('Mocks have been initialized', 'App');
};
