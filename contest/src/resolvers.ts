import { IResolvers } from 'graphql-tools'

export const resolvers: IResolvers = {
  Query: {
    user: (id: string) => ({
      id,
      contestId: 'contestId',
      username: 'username',
      email: 'email',
      name: 'name',
      permissions: [0],
    }),
  },
}
