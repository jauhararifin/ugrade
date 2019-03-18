import * as yup from 'yup'
import { idSchema } from './schemas'

export const languageServiceValidator = {
  getLanguageById: (id: string) =>
    yup
      .object()
      .shape({
        id: idSchema.required(),
      })
      .validate({ id }),
}
