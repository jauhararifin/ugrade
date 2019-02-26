import {
  Button,
  FormGroup,
  HTMLSelect,
  InputGroup,
  Intent,
  TextArea,
} from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React, { FunctionComponent } from 'react'

import { CreateClarificationFormValue } from './CreateClarificationForm'
import './styles.css'

export interface SubjectOption {
  label: string
  value: string
}

export interface CreateClarificationFormViewOwnProps {
  subjectOptions: SubjectOption[]
}

export type CreateClarificationFormViewProps = CreateClarificationFormViewOwnProps &
  FormikProps<CreateClarificationFormValue>

export const CreateClarificationFormView: FunctionComponent<
  CreateClarificationFormViewProps
> = ({
  handleSubmit,
  errors,
  values,
  handleChange,
  handleBlur,
  touched,
  isSubmitting,
  subjectOptions,
}) => (
  <form className='clarification-form' onSubmit={handleSubmit}>
    <h3>Create Clarification</h3>
    <div className='head'>
      <FormGroup
        label='Subject'
        className='group-subject'
        helperText={touched.subject && errors && errors.subject}
        intent={
          touched.subject && errors && errors.subject
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <HTMLSelect
          name='subject'
          fill={true}
          large={true}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.subject}
          options={subjectOptions}
        />
      </FormGroup>
      <FormGroup
        label='Title'
        className='group-title'
        helperText={touched.title && errors && errors.title}
        intent={
          touched.title && errors && errors.title ? Intent.DANGER : Intent.NONE
        }
      >
        <InputGroup
          name='title'
          placeholder='Title'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.title}
          large={true}
        />
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
      <TextArea
        name='content'
        placeholder='Your Clarification Here'
        fill={true}
        large={true}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.content}
        rows={7}
      />
    </FormGroup>
    <div className='right'>
      <Button
        type='submit'
        disabled={isSubmitting}
        intent={Intent.SUCCESS}
        large={true}
      >
        {isSubmitting ? 'Sending...' : 'Send'}
      </Button>
    </div>
  </form>
)
