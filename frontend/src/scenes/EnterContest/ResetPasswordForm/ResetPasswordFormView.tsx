import {
  Button,
  Card,
  Divider,
  FormGroup,
  InputGroup,
  Intent,
} from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React from 'react'
import { ContestInfo } from 'ugrade/contest/store'
import { ResetPasswordFormValue } from './ResetPasswordForm'

export interface ResetPasswordFormViewProps
  extends FormikProps<ResetPasswordFormValue> {
  contest: ContestInfo
  gotoAnotherContest: () => any
  gotoAnotherAccount: () => any
}

export const ResetPasswordFormView: React.FunctionComponent<
  ResetPasswordFormViewProps
> = ({
  handleSubmit,
  handleBlur,
  handleChange,
  values,
  errors,
  isSubmitting,
  touched,
  contest,
  gotoAnotherContest,
  gotoAnotherAccount,
}) => (
  <form onSubmit={handleSubmit}>
    <Card className='reset-password-panel'>
      <h2>Reset Password</h2>
      <h3>{contest.name}</h3>
      <p>{contest.shortDescription}</p>
      <FormGroup
        helperText={
          (touched.oneTimeCode && errors && errors.oneTimeCode) ||
          `Please check your email. We sent you an email containing one time code.`
        }
        labelFor='reset-password-input-one-time-code'
        intent={
          touched.oneTimeCode && errors && errors.oneTimeCode
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <InputGroup
          name='oneTimeCode'
          id='reset-password-input-one-time-code'
          large={true}
          placeholder='One Time Code'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.oneTimeCode}
          autoFocus={true}
        />
      </FormGroup>
      <FormGroup
        helperText={touched.password && errors && errors.password}
        labelFor='reset-password-input-password'
        intent={
          touched.password && errors && errors.password
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <InputGroup
          name='password'
          type='password'
          id='reset-password-input-password'
          large={true}
          placeholder='Password'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password}
        />
      </FormGroup>
      <Button
        type='submit'
        disabled={isSubmitting}
        fill={true}
        large={true}
        intent={Intent.SUCCESS}
      >
        {isSubmitting ? 'Resetting...' : 'Reset'}
      </Button>
      <div className='bottom-action'>
        <a onClick={gotoAnotherContest}>Go To Another Contest</a>
        <Divider />
        <a onClick={gotoAnotherAccount}>Change Account</a>
      </div>
    </Card>
  </form>
)
