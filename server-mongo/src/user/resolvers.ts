import { UserModel } from '../auth/models'
import { Contest } from '../contest/model'

export const userResolvers = {
  Query: {
    users: () => UserModel.find().exec(),
    user: (_parent, { id }) => UserModel.findById(id).exec(),
  },
  Contest: {
    members: ({ id }: Contest) => UserModel.find({ contest: id }),
  },
}
