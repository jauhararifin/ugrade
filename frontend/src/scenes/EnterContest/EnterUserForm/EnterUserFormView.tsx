import { Button, Card, FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React from 'react'

import './styles.css'

import { ContestInfo } from '../../../stores/Contest'
import { EnterUserFormValue } from './EnterUserForm'

export interface EnterUserFormViewProps
  extends FormikProps<EnterUserFormValue> {
  contestInfo: ContestInfo
}

const EnterUserFormView: React.FunctionComponent<EnterUserFormViewProps> = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  errors,
  submitCount,
  isSubmitting,
  contestInfo,
}) => (
  <form className='enter-user-panel' onSubmit={handleSubmit}>
    <Card>
      <h2>Sign In To</h2>
      <h3>{contestInfo.name}</h3>
      <p>{contestInfo.shortDescription}</p>
      <FormGroup
        helperText={submitCount > 0 && errors && errors.email}
        labelFor='enter-contest-input-email'
        intent={
          submitCount && errors && errors.email ? Intent.DANGER : Intent.NONE
        }
      >
        <InputGroup
          name='email'
          large={true}
          id='enter-contest-input-email'
          placeholder='Email'
          type='email'
          value={values.email}
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
        {isSubmitting ? 'Entering...' : 'Enter Contest'}
      </Button>
    </Card>
  </form>
)

export default EnterUserFormView
