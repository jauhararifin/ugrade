import { LanguageModel } from './model'

export const languageResolvers = {
  Query: {
    languages: () => LanguageModel.find().exec(),
    language: (_parent, { id }) => LanguageModel.findById(id).exec(),
    ping: () => `pong`,
  },
}
