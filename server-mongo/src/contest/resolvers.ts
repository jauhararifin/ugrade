import { ContestModel } from './model'
import { LanguageModel } from '../language/model'

export const contestResolvers = {
  Query: {
    contests: () => ContestModel.find(),
    contest: (_parent, { id }) => ContestModel.findById(id),
  },
  Contest: {
    permittedLanguages: async contest => {
      return LanguageModel.find({
        _id: { $in: contest.permittedLanguages },
      })
    },
  },
}
