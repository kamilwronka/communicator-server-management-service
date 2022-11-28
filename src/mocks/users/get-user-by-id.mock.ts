export const getUserByIdMock = {
  httpRequest: {
    path: '/users/internal/{id}',
    pathParameters: {
      id: ['[A-Za-z0-9\\-]+'],
    },
    method: 'GET',
  },
  httpResponse: {
    body: {
      id: '7aebe2db-8153-4ae4-9919-7cdcd324ff80',
      username: 'random username',
      avatar: 'https://image.com',
    },
  },
};
