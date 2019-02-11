import {
  Button,
  Card,
  Colors,
  FormGroup,
  InputGroup,
  Intent,
} from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React from 'react'

export interface SignUpFormValue {
  username: string
  name: string
  email: string
  password: string
}

export interface SignUpFormProps extends FormikProps<SignUpFormValue> {}

export const SignUpForm: React.SFC<SignUpFormProps> = ({
  handleSubmit,
  handleBlur,
  handleChange,
  values,
  errors,
  status,
  submitCount,
  isSubmitting,
  touched,
}) => (
  <form onSubmit={handleSubmit}>
    <Card className='signup-panel'>
      <h2>Sign Up</h2>
      {status && !status.success && (
        <h5 style={{ color: Colors.RED2 }}>{status.message}</h5>
      )}
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
        helperText={submitCount > 0 && errors && errors.email}
        labelFor='signup-page-input-email'
        intent={
          submitCount && errors && errors.email ? Intent.DANGER : Intent.NONE
        }
      >
        <InputGroup
          name='email'
          id='signup-page-input-email'
          type='email'
          large={true}
          placeholder='Email'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email}
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
      <Button
        type='submit'
        disabled={isSubmitting}
        fill={true}
        large={true}
        intent={Intent.SUCCESS}
      >
        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
      </Button>
    </Card>
  </form>
)
