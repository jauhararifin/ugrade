import { uuidSchema } from 'ugrade/uuid'
import * as yup from 'yup'

export const languageServiceValidator = {
  getLanguageById: (id: string) =>
    yup
      .object()
      .shape({
        id: uuidSchema.required(),
      })
      .validate({ id }),
}
