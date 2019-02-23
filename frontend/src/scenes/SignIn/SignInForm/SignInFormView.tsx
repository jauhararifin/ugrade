import {
  Button,
  Card,
  FormGroup,
  InputGroup,
  Intent,
  Switch,
} from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React from 'react'

import './styles.css'

import { SignInFormValue } from './SignInForm'

export type SignInFormViewProps = FormikProps<SignInFormValue>

const SignInFormView: React.FunctionComponent<SignInFormViewProps> = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  errors,
  submitCount,
  isSubmitting,
}) => (
  <form onSubmit={handleSubmit}>
    <Card className='signin-panel'>
      <h2>Sign In</h2>
      <FormGroup
        helperText={submitCount > 0 && errors && errors.usernameOrEmail}
        labelFor='signin-input-username-email'
        intent={
          submitCount && errors && errors.usernameOrEmail
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <InputGroup
          name='username'
          large={true}
          id='signin-input-username-email'
          placeholder='Username Or Email'
          value={values.usernameOrEmail}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FormGroup>
      <FormGroup
        helperText={submitCount > 0 && errors && errors.password}
        labelFor='signin-input-passowrd'
        intent={
          submitCount && errors && errors.password ? Intent.DANGER : Intent.NONE
        }
      >
        <InputGroup
          name='password'
          large={true}
          id='signin-input-password'
          placeholder='Password'
          type='password'
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FormGroup>
      <div className='remember-me'>
        <div>Remember Me</div>
        <div>
          <Switch
            name='rememberMe'
            checked={values.rememberMe}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </div>
      <Button
        type='submit'
        disabled={isSubmitting}
        fill={true}
        large={true}
        intent={Intent.SUCCESS}
      >
        {isSubmitting ? 'Signing In...' : 'Sign In'}
      </Button>
    </Card>
  </form>
)

export default SignInFormView
