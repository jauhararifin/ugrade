import { Button, Intent } from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React, { FunctionComponent } from 'react'
import { ContestRegisterFormValue } from './ContestRegisterForm'

export type ContestRegisterFormViewProps = FormikProps<ContestRegisterFormValue>

export const ContestRegisterFormView: FunctionComponent<
  ContestRegisterFormViewProps
> = ({ handleSubmit, isSubmitting, values }) => {
  const text = values.register ? 'Register' : 'Unregister'
  const loadingText = values.register ? 'Registering...' : 'Unregistering...'
  return (
    <form onSubmit={handleSubmit}>
      <Button
        fill={true}
        intent={values.register ? Intent.PRIMARY : Intent.DANGER}
        type='submit'
        text={isSubmitting ? loadingText : text}
      />
    </form>
  )
}
