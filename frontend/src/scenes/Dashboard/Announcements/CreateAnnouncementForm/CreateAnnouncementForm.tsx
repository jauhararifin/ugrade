import { Formik, FormikActions } from 'formik'
import React, { FunctionComponent } from 'react'
import { useContestOnly } from 'ugrade/auth'
import { handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { useCreateAnnouncement } from 'ugrade/contest/announcement'
import * as yup from 'yup'
import { CreateAnnouncementFormView } from './CreateAnnouncementFormView'

export interface CreateAnnouncementFormValue {
  title: string
  content: string
}

export const CreateAnnouncementForm: FunctionComponent = () => {
  useContestOnly()

  const validationSchema = yup.object().shape({
    title: yup.string().required(),
    content: yup.string().required(),
  })

  const initialValue: CreateAnnouncementFormValue = {
    title: '',
    content: '',
  }

  const createAnnouncement = useCreateAnnouncement()

  const handleSubmit = async (
    values: CreateAnnouncementFormValue,
    { setSubmitting, resetForm }: FormikActions<CreateAnnouncementFormValue>
  ) => {
    try {
      await createAnnouncement(values.title, values.content)
      TopToaster.showSuccessToast('Announcement Created')
    } catch (error) {
      if (!handleCommonError(error)) throw error
    } finally {
      setSubmitting(false)
      resetForm()
    }
  }

  return (
    <Formik
      initialValues={initialValue}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      component={CreateAnnouncementFormView}
    />
  )
}
