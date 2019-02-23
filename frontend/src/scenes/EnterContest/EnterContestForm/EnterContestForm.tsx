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
  onSubmit: (contestId: string) => Promise<any>
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

  handleSubmit = async (
    values: EnterContestFormValue,
    { setSubmitting }: FormikActions<EnterContestFormValue>
  ) => {
    try {
      await this.props.onSubmit(values.contestId)
    } finally {
      setSubmitting(false)
    }
  }

  render() {
    return (
      <Formik
        initialValues={this.initialValue}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
        component={EnterContestFormView}
      />
    )
  }
}

export default compose<ComponentType<EnterContestFormProps>>(publicOnly())(
  EnterContestForm
)
