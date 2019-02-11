import {
  Button,
  Colors,
  FormGroup,
  InputGroup,
  Intent,
  Switch,
} from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React from 'react'

import './styles.css'

export interface SignInFormValue {
  username: string
  password: string
  rememberMe: boolean
}

export interface SignInFormProps extends FormikProps<SignInFormValue> {}

const SignInForm: React.FunctionComponent<SignInFormProps> = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  errors,
  status,
  submitCount,
  isSubmitting,
}) => (
  <form onSubmit={handleSubmit}>
    {status && !status.success && (
      <h5 style={{ color: Colors.RED2 }}>{status.message}</h5>
    )}
    <FormGroup
      helperText={submitCount > 0 && errors && errors.username}
      labelFor='signin-input-username'
      intent={
        submitCount && errors && errors.username ? Intent.DANGER : Intent.NONE
      }
    >
      <InputGroup
        name='username'
        large={true}
        id='signin-input-username'
        placeholder='Username'
        value={values.username}
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
  </form>
)

export default SignInForm
