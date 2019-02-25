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

import { ContestInfo } from '../../../stores/Contest'
import { SignUpFormValue } from './SignUpForm'

export interface SignUpFormViewProps extends FormikProps<SignUpFormValue> {
  contest: ContestInfo
  gotoAnotherContest: () => any
  gotoAnotherAccount: () => any
}

export const SignUpFormView: React.FunctionComponent<SignUpFormViewProps> = ({
  handleSubmit,
  handleBlur,
  handleChange,
  values,
  errors,
  submitCount,
  isSubmitting,
  touched,
  contest,
  gotoAnotherContest,
  gotoAnotherAccount,
}) => (
  <form onSubmit={handleSubmit}>
    <Card className='signup-panel'>
      <h2>Sign Up To</h2>
      <h3>{contest.name}</h3>
      <p>{contest.shortDescription}</p>
      <FormGroup
        helperText={submitCount > 0 && errors && errors.username}
        labelFor='signup-page-input-username'
        intent={
          submitCount && errors && errors.username ? Intent.DANGER : Intent.NONE
        }
      >
        <InputGroup
          name='username'
          id='signup-page-input-username'
          large={true}
          placeholder='Username'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.username}
        />
      </FormGroup>

      <FormGroup
        helperText={submitCount > 0 && errors && errors.name}
        labelFor='signup-page-input-name'
        intent={
          submitCount && errors && errors.name ? Intent.DANGER : Intent.NONE
        }
      >
        <InputGroup
          name='name'
          id='signup-page-input-name'
          large={true}
          placeholder='Name'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.name}
        />
      </FormGroup>
      <FormGroup
        helperText={
          (touched.oneTimeCode && errors && errors.oneTimeCode) ||
          `Please check your email. We sent you an email containing one time code.`
        }
        labelFor='signup-page-input-one-time-code'
        intent={
          touched.oneTimeCode && errors && errors.oneTimeCode
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <InputGroup
          name='oneTimeCode'
          id='signup-page-input-one-time-code'
          large={true}
          placeholder='One Time Code'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.oneTimeCode}
        />
      </FormGroup>
      <FormGroup
        helperText={touched.password && errors && errors.password}
        labelFor='signup-page-input-password'
        intent={
          touched.password && errors && errors.password
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <InputGroup
          name='password'
          type='password'
          id='signup-page-input-password'
          large={true}
          placeholder='Password'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password}
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
        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
      </Button>
      <div className='bottom-action'>
        <a onClick={gotoAnotherContest}>Go To Another Contest</a>
        <Divider />
        <a onClick={gotoAnotherAccount}>Change Account</a>
      </div>
    </Card>
  </form>
)
