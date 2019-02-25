import { Formik, FormikActions } from 'formik'
import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as yup from 'yup'

import ActionToaster from '../../../helpers/ActionToaster/ActionToaster'
import { publicOnly } from '../../../helpers/auth'
import { ContestError } from '../../../services/contest/errors'
import { AppThunkDispatch } from '../../../stores'
import { setContestAction } from './actions'
import EnterContestFormView from './EnterContestFormView'

export interface EnterContestFormValue {
  contestId: string
}

export interface EnterContestFormProps {
  dispatch: AppThunkDispatch
}

class EnterContestForm extends React.Component<EnterContestFormProps> {
  initialValue: EnterContestFormValue = {
    contestId: '',
  }

  validationSchema = yup.object().shape({
    contestId: yup
      .string()
      .min(4)
      .max(255)
      .label('Contest ID')
      .matches(
        /[a-zA-Z0-9\-]+/,
        'Contest ID contains alphanumeric and dash character only'
      )
      .required(),
  })

  handleSubmit = async (
    values: EnterContestFormValue,
    { setSubmitting }: FormikActions<EnterContestFormValue>
  ) => {
    try {
      await this.props.dispatch(setContestAction(values.contestId))
    } catch (error) {
      if (error instanceof ContestError) ActionToaster.showErrorToast(error)
      else throw error
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

export default compose<ComponentType<EnterContestFormProps>>(
  publicOnly(),
  connect()
)(EnterContestForm)
