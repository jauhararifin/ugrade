import React from "react"
import { FormikActions, Formik } from "formik"
import { connect } from "react-redux"
import * as yup from 'yup'

import { AppThunkDispatch, AppState } from "../../../stores"
import MyAccountProfileForm, { MyAccountProfileFormValue } from "./MyAccountProfileForm"
import { ShirtSizeType, GenderType, User } from "../../../stores/Auth"
import { genderValues, shirtSizeValues } from "./helpers"
import { setProfile } from "./actions"

export interface MyAccountProfileSceneProps {
  dispatch: AppThunkDispatch
  me: User
}

export class MyAccountProfileScene extends React.Component<MyAccountProfileSceneProps> {

  validationSchema = yup.object().shape({
    name: yup.string().label("Name").required(),
    shirtSize: yup.string().label("Shirt Size").oneOf(shirtSizeValues) ,
    gender: yup.string().label("Gender").oneOf(genderValues),
    address: yup.string().label("Name"),
  })

  handleSubmit = (values: MyAccountProfileFormValue, { setSubmitting }: FormikActions<MyAccountProfileFormValue>) => {
    const { name, shirtSize, gender, address, } = values
    this.props.dispatch(setProfile(name, shirtSize as ShirtSizeType, gender as GenderType, address))
      .finally(() => setSubmitting(false))
  }

  render() {
    return <Formik
        initialValues={this.props.me}
        onSubmit={this.handleSubmit}
        validationSchema={this.validationSchema}
        render={MyAccountProfileForm}
    />
  }
}

const mapStateToProps = (state: AppState) => ({
  me: state.auth.me
})
export default connect(mapStateToProps)(MyAccountProfileScene as any)
