export const getServerInvitesMock = {
  httpRequest: {
    path: '/invites/servers/{id}',
    pathParameters: {
      id: ['[A-Za-z0-9\\-]+'],
    },
    method: 'GET',
  },
  httpResponse: {
    body: [
      {
        _id: '6384992a9ee2ea7a3cc0d2c2',
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
      },
      {
        _id: '6384992a9ee2ea7a3cc0d2c3',
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
      },
    ],
  },
};
