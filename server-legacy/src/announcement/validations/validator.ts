import { tokenSchema } from 'ugrade/auth/validations'
import * as yup from 'yup'
import { announcementIdSchema, contentSchema, titleSchema } from './schemas'

export const announcementServiceValidator = {
  getContestAnnouncements: (token: string, contestId: string) =>
    yup
      .object()
      .shape({
        token: tokenSchema.required(),
        contestId: announcementIdSchema.required(),
      })
      .validate({ token, contestId }),

  createAnnouncement: (token: string, title: string, content: string) =>
    yup
      .object()
      .shape({
        token: tokenSchema.required(),
        title: titleSchema.required(),
        content: contentSchema.required(),
      })
      .validate({ token, title, content }),

  readAnnouncement: (token: string, announcementId: string) =>
    yup
      .object()
      .shape({
        token: tokenSchema.required(),
        announcementId: announcementIdSchema.required(),
      })
      .validate({ token, announcementId }),
}
