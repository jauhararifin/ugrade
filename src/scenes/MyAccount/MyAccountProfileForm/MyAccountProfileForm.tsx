import { Formik, FormikActions } from 'formik'
import React from 'react'
import { connect } from 'react-redux'
import * as yup from 'yup'

import { AppState, AppThunkDispatch } from '../../../stores'
import { GenderType, ShirtSizeType, User } from '../../../stores/Auth'
import { setTitle } from '../../../stores/Title'
import { setProfile } from './actions'
import { genderValues, shirtSizeValues } from './helpers'
import MyAccountProfileFormView from './MyAccountProfileFormView'

export interface MyAccountProfileFormValue {
  name: string
  gender?: GenderType
  address?: string
  shirtSize?: ShirtSizeType
}

export interface MyAccountProfileFormProps {
  dispatch: AppThunkDispatch
  me: User
}

export class MyAccountProfileForm extends React.Component<
  MyAccountProfileFormProps
> {
  validationSchema = yup.object().shape({
    name: yup
      .string()
      .label('Name')
      .required(),
    shirtSize: yup
      .string()
      .label('Shirt Size')
      .oneOf(shirtSizeValues),
    gender: yup
      .string()
      .label('Gender')
      .oneOf(genderValues),
    address: yup.string().label('Name'),
  })

  componentDidMount() {
    this.props.dispatch(setTitle('UGrade | My Account'))
  }

  handleSubmit = (
    values: MyAccountProfileFormValue,
    { setSubmitting }: FormikActions<MyAccountProfileFormValue>
  ) => {
    const { name, shirtSize, gender, address } = values
    this.props
      .dispatch(
        setProfile(
          name,
          shirtSize as ShirtSizeType,
          gender as GenderType,
          address
        )
      )
      .finally(() => setSubmitting(false))
      .catch(_ => null)
  }

  render() {
    return (
      <Formik
        initialValues={this.props.me}
        onSubmit={this.handleSubmit}
        validationSchema={this.validationSchema}
        render={MyAccountProfileFormView}
      />
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  me: state.auth.me,
})
export default connect(mapStateToProps)(MyAccountProfileForm as any)
