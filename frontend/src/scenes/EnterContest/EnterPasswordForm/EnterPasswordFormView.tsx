import {
  Button,
  Card,
  Divider,
  FormGroup,
  InputGroup,
  Intent,
  Switch,
} from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React from 'react'

import './styles.css'

import { ContestInfo } from '../../../stores/Contest'
import { EnterPasswordFormValue } from './EnterPasswordForm'

export interface EnterPasswordFormViewProps
  extends FormikProps<EnterPasswordFormValue> {
  contestInfo: ContestInfo
  gotoAnotherContest: () => any
  forgotPassword: (setSubmitting: (isSubmitting: boolean) => void) => any
}

const EnterPasswordFormView: React.FunctionComponent<
  EnterPasswordFormViewProps
> = props => {
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    submitCount,
    isSubmitting,
    setSubmitting,
    contestInfo,
    gotoAnotherContest,
    forgotPassword,
  } = props
  return (
    <form className='enter-password-panel' onSubmit={handleSubmit}>
      <Card>
        <h2>Sign In To</h2>
        <h3>{contestInfo.name}</h3>
        <p>{contestInfo.shortDescription}</p>
        <FormGroup
          helperText={submitCount > 0 && errors && errors.password}
          labelFor='enter-contest-input-password'
          intent={
            submitCount && errors && errors.password
              ? Intent.DANGER
              : Intent.NONE
          }
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
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
        <div className='bottom-action'>
          <a onClick={forgotPassword.bind(null, setSubmitting)}>
            I Forgot My Password
          </a>
          <Divider />
          <a onClick={gotoAnotherContest}>Go To Another Contest</a>
        </div>
      </Card>
    </form>
  )
}

export default EnterPasswordFormView
