import { Button, Card, FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React, { FunctionComponent } from 'react'
import { MarkdownEdit } from 'ugrade/components/MarkdownEdit'
import { CreateAnnouncementFormValue } from './CreateAnnouncementForm'

import './styles.css'

export type CreateAnnouncementFormViewProps = FormikProps<
  CreateAnnouncementFormValue
>

export const CreateAnnouncementFormView: FunctionComponent<
  CreateAnnouncementFormViewProps
> = ({
  handleSubmit,
  errors,
  values,
  handleChange,
  handleBlur,
  touched,
  isSubmitting,
  setFieldValue,
}) => (
  <form className='announcement-form' onSubmit={handleSubmit}>
    <Card className='card' elevation={2}>
      <h3>Create Announcement</h3>
      <div className='head'>
        <FormGroup
          className='group-title'
          helperText={touched.title && errors && errors.title}
          intent={
            touched.title && errors && errors.title
              ? Intent.DANGER
              : Intent.NONE
          }
        >
          <InputGroup
            name='title'
            placeholder='Give Title To Your Announcement'
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.title}
            large={true}
          />
        </FormGroup>
        <FormGroup className='group-submit'>
          <Button
            type='submit'
            disabled={isSubmitting}
            intent={Intent.SUCCESS}
            large={true}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </Button>
        </FormGroup>
      </div>
      <FormGroup
        helperText={touched.content && errors && errors.content}
        intent={
          touched.content && errors && errors.content
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <MarkdownEdit
          name='content'
          onChange={setFieldValue.bind(null, 'content')}
          value={values.content}
        />
      </FormGroup>
    </Card>
  </form>
)
