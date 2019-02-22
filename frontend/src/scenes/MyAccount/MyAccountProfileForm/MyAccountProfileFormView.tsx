import {
  Button,
  Divider,
  FormGroup,
  HTMLSelect,
  InputGroup,
  Intent,
  TextArea,
} from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React from 'react'

import {
  genderToString,
  genderValues,
  shirtSizeToString,
  shirtSizeValues,
} from './helpers'
import { MyAccountProfileFormValue } from './MyAccountProfileForm'

export interface MyAccountProfileFormViewProps
  extends FormikProps<MyAccountProfileFormValue> {}

export const MyAccountProfileFormView: React.FunctionComponent<
  MyAccountProfileFormViewProps
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
      <h3>Account Profile</h3>
      <Divider />

      <FormGroup
        label='Name'
        helperText={touched.name && errors && (errors.name || errors.name)}
        intent={
          touched.name && errors && (errors.name || errors.name)
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <InputGroup
          name='name'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.name}
        />
      </FormGroup>

      <FormGroup
        label='Gender'
        helperText={
          touched.gender && errors && (errors.gender || errors.gender)
        }
        intent={
          touched.gender && errors && (errors.gender || errors.gender)
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <HTMLSelect
          name='gender'
          fill={true}
          onChange={handleChange}
          onBlur={handleBlur}
          value={genderToString(values.gender)}
          options={genderValues}
        />
      </FormGroup>

      <FormGroup
        label='Shirt Size'
        helperText={
          touched.shirtSize && errors && (errors.shirtSize || errors.shirtSize)
        }
        intent={
          touched.shirtSize && errors && (errors.shirtSize || errors.shirtSize)
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <HTMLSelect
          name='shirtSize'
          fill={true}
          onChange={handleChange}
          onBlur={handleBlur}
          value={shirtSizeToString(values.shirtSize)}
          options={shirtSizeValues}
        />
      </FormGroup>

      <FormGroup
        label='Address'
        helperText={
          touched.address && errors && (errors.address || errors.address)
        }
        intent={
          touched.address && errors && (errors.address || errors.address)
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <TextArea
          name='address'
          fill={true}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.address}
        />
      </FormGroup>

      <div className='right'>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  </form>
)

export default MyAccountProfileFormView
