import { Button, Card, Divider, FormGroup, InputGroup, Intent, Switch } from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React, { useState } from 'react'
import { EnterPasswordFormValue } from './EnterPasswordForm'

import './styles.css'

export interface EnterPasswordFormViewProps extends FormikProps<EnterPasswordFormValue> {
  contest: {
    name: string
    shortDescription: string
  }
  username: string
  gotoAnotherContest: () => any
  gotoAnotherAccount: () => any
  forgotPassword: (setSubmitting: (isSubmitting: boolean) => void) => any
}

export const EnterPasswordFormView: React.FunctionComponent<EnterPasswordFormViewProps> = props => {
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    submitCount,
    isSubmitting,
    setSubmitting,
    contest,
    gotoAnotherContest,
    forgotPassword,
    gotoAnotherAccount,
    submitForm,
    username,
  } = props
  const forgotPasswordClick = () => {
    setSubmitting(true)
    forgotPassword(setSubmitting)
    setforgotPasswordSubmit(true)
  }
  const signinClick = () => {
    setforgotPasswordSubmit(false)
    submitForm()
  }
  const [forgotPasswordSubmit, setforgotPasswordSubmit] = useState(false)
  return (
    <form className='enter-password-panel' onSubmit={handleSubmit}>
      <input name='username' type='hidden' value={username} />
      <Card>
        <h2>Sign In To</h2>
        <h3>{contest.name}</h3>
        <p>{contest.shortDescription}</p>
        <FormGroup
          helperText={submitCount > 0 && errors && errors.password}
          labelFor='enter-contest-input-password'
          intent={submitCount && errors && errors.password ? Intent.DANGER : Intent.NONE}
        >
          <InputGroup
            name='password'
            large={true}
            id='enter-contest-input-password'
            placeholder='Password'
            type='password'
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus={true}
          />
        </FormGroup>
        <div className='remember-me'>
          <div>Remember Me</div>
          <div>
            <Switch name='rememberMe' checked={values.rememberMe} onChange={handleChange} onBlur={handleBlur} />
          </div>
        </div>
        <Button disabled={isSubmitting} fill={true} large={true} intent={Intent.SUCCESS} onClick={signinClick}>
          {isSubmitting && !forgotPasswordSubmit ? 'Signing in...' : 'Sign In'}
        </Button>
        <Button
          className='forgot-password-button'
          disabled={isSubmitting}
          fill={true}
          large={true}
          onClick={forgotPasswordClick}
        >
          {isSubmitting && forgotPasswordSubmit ? 'Resetting...' : 'I Forgot My Password'}
        </Button>
        <div className='bottom-action'>
          <a onClick={gotoAnotherContest}>Go To Another Contest</a>
          <Divider />
          <a onClick={gotoAnotherAccount}>Change Account</a>
        </div>
      </Card>
    </form>
  )
}
