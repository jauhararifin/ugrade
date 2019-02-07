import React, { ComponentType } from "react"
import { Formik, FormikActions } from "formik"
import { compose } from "redux"
import * as yup from 'yup'
import { connect } from "react-redux"

import "./styles.css"

import { ForgotPasswordFormValue } from "./ForgotPasswordForm"
import { forgotPasswordAction } from "./actions"
import { AppThunkDispatch } from "../../stores"
import ActionToaster from "../../middlewares/ErrorToaster/ActionToaster"
import { publicOnly } from "../../helpers/auth"
import ForgotPasswordPage from "./ForgotPasswordPage"

export interface ForgotPasswordSceneProps {
    dispatch: AppThunkDispatch
}

export class ForgotPasswordScene extends React.Component<ForgotPasswordSceneProps> {
    
    initialValue = { usernameOrEmail: '' }
    
    validationSchema = yup.object().shape({
        usernameOrEmail: yup.string().label("username or email").required(),
    })

    handleSubmit = (values: ForgotPasswordFormValue, { setSubmitting, resetForm }: FormikActions<ForgotPasswordFormValue>) => {
        this.props.dispatch(forgotPasswordAction(values.usernameOrEmail))
            .then(result => ActionToaster.showSuccessToast('Check Your Email'))
            .finally(() => {
                setSubmitting(false)
                resetForm()
            })
    }

    render() {
        return <Formik
            initialValues={this.initialValue}
            validationSchema={this.validationSchema}
            onSubmit={this.handleSubmit}
            render={ForgotPasswordPage}
        />
    }
}

export default compose<ComponentType>(
    publicOnly(),
    connect(),
)(ForgotPasswordScene)