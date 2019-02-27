import {
  Button,
  Divider,
  FormGroup,
  InputGroup,
  Intent,
  Label,
} from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React from 'react'
import { MyAccountPasswordFormValue } from './MyAccountPassword'

export type MyAccountPasswordFormViewProps = FormikProps<
  MyAccountPasswordFormValue
>

export const MyAccountPasswordFormView: React.FunctionComponent<
  MyAccountPasswordFormViewProps
> = ({
  handleSubmit,
  handleBlur,
  handleChange,
  values,
  errors,
  touched,
  isSubmitting,
}) => (
  <form onSubmit={handleSubmit}>
    <div className='my-account-page-content'>
      <h3>Password</h3>
      <Divider />

      <FormGroup
        label='Your Old Password'
        helperText={
          touched.oldPassword &&
          errors &&
          (errors.oldPassword || errors.oldPassword)
        }
        intent={
          touched.oldPassword &&
          errors &&
          (errors.oldPassword || errors.oldPassword)
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <Label>
          <InputGroup
            type='password'
            name='oldPassword'
            autoComplete='current-password'
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.oldPassword}
          />
        </Label>
      </FormGroup>

      <FormGroup
        label='New Password'
        helperText={
          touched.newPassword &&
          errors &&
          (errors.newPassword || errors.newPassword)
        }
        intent={
          touched.newPassword &&
          errors &&
          (errors.newPassword || errors.newPassword)
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <Label>
          <InputGroup
            type='password'
            name='newPassword'
            autoComplete='new-password'
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.newPassword}
          />
        </Label>
      </FormGroup>

      <FormGroup
        label='Confirmation Password'
        helperText={
          touched.confirmation &&
          errors &&
          (errors.confirmation || errors.confirmation)
        }
        intent={
          touched.confirmation &&
          errors &&
          (errors.confirmation || errors.confirmation)
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <Label>
          <InputGroup
            type='password'
            name='confirmation'
            autoComplete='confirmation-password'
            placeholder='Repeat Your New Password'
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.confirmation}
          />
        </Label>
      </FormGroup>

      <div className='right'>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Password'}
        </Button>
      </div>
    </div>
  </form>
)

export default MyAccountPasswordFormView
