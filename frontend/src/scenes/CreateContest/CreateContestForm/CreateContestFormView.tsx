import { Button, Card, FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React from 'react'

import './styles.css'

import { CreateContestFormValue } from './CreateContestForm'

export type CreateContestFormViewProps = FormikProps<CreateContestFormValue>

const CreateContestFormView: React.FunctionComponent<
  CreateContestFormViewProps
> = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  errors,
  submitCount,
  isSubmitting,
}) => (
  <form className='create-contest-panel' onSubmit={handleSubmit}>
    <Card>
      <h2>Create Contest</h2>
      <p>Insert Your Email, Contest ID, and Contest Name</p>
      <FormGroup
        helperText={submitCount > 0 && errors && errors.email}
        labelFor='create-contest-input-email'
        intent={
          submitCount && errors && errors.email ? Intent.DANGER : Intent.NONE
        }
      >
        <InputGroup
          name='email'
          large={true}
          id='create-contest-input-email'
          placeholder='Email'
          type='email'
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FormGroup>
      <FormGroup
        helperText={
          (submitCount > 0 && errors && errors.contestShortId) ||
          `Contest identifier, should unique for every contest`
        }
        labelFor='create-contest-input-short-id'
        intent={
          submitCount && errors && errors.contestShortId
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <InputGroup
          name='contestShortId'
          large={true}
          id='create-contest-input-short-id'
          placeholder='Contest ID'
          value={values.contestShortId}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FormGroup>
      <FormGroup
        helperText={submitCount > 0 && errors && errors.contestName}
        labelFor='create-contest-input-contest-name'
        intent={
          submitCount && errors && errors.contestName
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <InputGroup
          name='contestName'
          large={true}
          id='create-contest-input-contest-name'
          placeholder='Contest Name'
          value={values.contestName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FormGroup>
      <FormGroup
        helperText={submitCount > 0 && errors && errors.contestName}
        labelFor='create-contest-input-contest-short-desc'
        intent={
          submitCount && errors && errors.contestShortDescription
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <InputGroup
          name='contestShortDescription'
          large={true}
          id='create-contest-input-contest-short-desc'
          placeholder='Short Description'
          value={values.contestShortDescription}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FormGroup>
      <Button
        type='submit'
        disabled={isSubmitting}
        fill={true}
        large={true}
        intent={Intent.SUCCESS}
      >
        {isSubmitting ? 'Creating Contest...' : 'Create Contest'}
      </Button>
    </Card>
  </form>
)

export default CreateContestFormView
