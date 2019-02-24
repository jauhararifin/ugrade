import { Formik, FormikActions } from 'formik'
import React, { ComponentType } from 'react'
import { compose } from 'redux'
import * as yup from 'yup'

import { publicOnly } from '../../../helpers/auth'
import EnterContestFormView from './EnterContestFormView'

export interface EnterContestFormValue {
  contestId: string
}

export interface EnterContestFormProps {
  onSubmit: (
    values: EnterContestFormValue,
    { setSubmitting }: FormikActions<EnterContestFormValue>
  ) => any
}

class EnterContestForm extends React.Component<EnterContestFormProps, {}> {
  initialValue: EnterContestFormValue = {
    contestId: '',
  }

  validationSchema = yup.object().shape({
    contestId: yup
      .string()
      .min(4)
      .max(255)
      .label('Contest ID')
      .matches(/[a-zA-Z0-9\-]+/)
      .required(),
  })

  render() {
    return (
      <Formik
        initialValues={this.initialValue}
        validationSchema={this.validationSchema}
        onSubmit={this.props.onSubmit}
        component={EnterContestFormView}
      />
    )
  }
}

export default compose<ComponentType<EnterContestFormProps>>(publicOnly())(
  EnterContestForm
)
