export const getInviteByIdMock = {
  httpRequest: {
    path: '/invites/{id}',
    pathParameters: {
      id: ['[A-Za-z0-9\\-]+'],
    },
    method: 'GET',
  },
  httpResponse: {
    body: {
      maxAge: 0,
      maxUses: 0,
      server: {
        id: '638490b78056b2345589fe45',
        name: 'random server name',
        icon: 'https://image.com/test.png',
      },
      inviter: {
        id: '7aebe2db-8153-4ae4-9919-7cdcd324ff80',
        username: 'random username',
        avatar: 'https://image.com',
      },
      _id: '6384cd2a13b03e7908051bf0',
    },
  },
};
