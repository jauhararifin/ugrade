import { Button, Intent, TextArea } from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React, { FunctionComponent } from 'react'

import './styles.css'

import { CreateClarificationEntryFormValues } from './CreateClarificationEntryForm'

export interface CreateClarificationEntryFormViewOwnProps {
  clarificationId: number
}

export type CreateClarificationEntryFormViewProps = CreateClarificationEntryFormViewOwnProps &
  FormikProps<CreateClarificationEntryFormValues>

export const CreateClarificationEntryFormView: FunctionComponent<
  CreateClarificationEntryFormViewProps
> = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  errors,
  submitCount,
  touched,
  isSubmitting,
}) => (
  <form className='reply-form' onSubmit={handleSubmit}>
    <TextArea
      className='reply-message'
      name='content'
      rows={3}
      fill={true}
      placeholder='Reply the clarifications here...'
      value={values.content}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={isSubmitting}
      intent={
        submitCount > 0 && touched.content && errors && errors.content
          ? Intent.DANGER
          : Intent.NONE
      }
    />
    <div className='send-reply'>
      <Button
        intent={Intent.PRIMARY}
        disabled={isSubmitting}
        minimal={true}
        fill={true}
        icon='circle-arrow-right'
        type='submit'
      />
    </div>
  </form>
)
