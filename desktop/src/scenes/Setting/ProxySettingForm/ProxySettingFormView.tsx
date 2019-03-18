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
import { ProxySettingFormValue } from './ProxySettingForm'

export type ProxySettingFormViewProps = FormikProps<ProxySettingFormValue>

export const ProxySettingFormView: React.FunctionComponent<
  ProxySettingFormViewProps
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
    <div className='setting-page-content'>
      <h3>Proxy Setting</h3>
      <Divider />
      <FormGroup
        label='Proxy Host'
        helperText={touched.host && errors && (errors.host || errors.port)}
        intent={
          touched.host && errors && (errors.host || errors.port)
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <Label>
          <InputGroup
            name='host'
            placeholder='Host'
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.host}
          />
        </Label>
        <Label>
          <InputGroup
            name='port'
            placeholder='Port'
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.port}
          />
        </Label>
      </FormGroup>
      <FormGroup
        label='Proxy Authentication'
        helperText={
          touched.host && errors && (errors.username || errors.password)
        }
        intent={
          touched.host && errors && (errors.username || errors.password)
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <Label>
          <InputGroup
            name='username'
            placeholder='Username'
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.username}
          />
        </Label>
        <Label>
          <InputGroup
            type='password'
            name='password'
            placeholder='Password'
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
          />
        </Label>
      </FormGroup>
      <div className='right'>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Proxy'}
        </Button>
      </div>
    </div>
  </form>
)
