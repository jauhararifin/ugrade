import { Formik, FormikActions } from 'formik'
import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { getMe, User } from 'ugrade/auth/store'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { contestOnly } from 'ugrade/helpers/auth'
import { AppState, AppThunkDispatch } from 'ugrade/store'
import {
  GenderType,
  ShirtSizeType,
  UserProfileState,
} from 'ugrade/userprofile/store'
import * as yup from 'yup'
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
  profile: UserProfileState
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

  handleSubmit = async (
    values: MyAccountProfileFormValue,
    { setSubmitting }: FormikActions<MyAccountProfileFormValue>
  ) => {
    const { name, shirtSize, gender, address } = values
    try {
      await this.props.dispatch(
        setProfile(
          name,
          shirtSize as ShirtSizeType,
          gender as GenderType,
          address
        )
      )
      TopToaster.showSuccessToast('Profile Changed')
    } finally {
      setSubmitting(false)
    }
  }

  render() {
    const initialValues = {
      name: this.props.me.name,
      gender: this.props.profile.gender,
      address: this.props.profile.address,
      shirtSize: this.props.profile.shirtSize,
    }
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        validationSchema={this.validationSchema}
        render={MyAccountProfileFormView}
      />
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  me: getMe(state),
  profile: state.userProfile,
})
export default compose<ComponentType>(
  contestOnly(),
  connect(mapStateToProps)
)(MyAccountProfileForm)
