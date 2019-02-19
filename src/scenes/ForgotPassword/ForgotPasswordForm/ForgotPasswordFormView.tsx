import { Button, Card, FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React, { FunctionComponent } from 'react'

import './styles.css'

import { ForgotPasswordFormValue } from './ForgotPasswordForm'

export type ForgotPasswordFormViewProps = FormikProps<ForgotPasswordFormValue>

export const ForgotPasswordFormView: FunctionComponent<
  ForgotPasswordFormViewProps
> = ({
  handleSubmit,
  handleBlur,
  handleChange,
  values,
  errors,
  submitCount,
  isSubmitting,
}) => (
  <form onSubmit={handleSubmit}>
    <Card className='forgot-password-panel'>
      <h2>Forgot Password</h2>
      <p>
        Enter your username or email. We'll email instruction on how to reset
        your password.
      </p>
      <FormGroup
        labelFor='forgot-password-input-username'
        helperText={submitCount > 0 && errors && errors.usernameOrEmail}
        intent={
          submitCount && errors && errors.usernameOrEmail
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <InputGroup
          name='usernameOrEmail'
          id='forgot-password-input-username'
          large={true}
          placeholder='Username Or Email'
          autoFocus={true}
          value={values.usernameOrEmail}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FormGroup>
      <Button
        type='submit'
        fill={true}
        large={true}
        intent={Intent.SUCCESS}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </Card>
  </form>
)
