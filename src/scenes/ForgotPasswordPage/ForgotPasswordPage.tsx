import React from "react"
import { Divider } from "@blueprintjs/core"
import { Link } from "react-router-dom"
import { Formik, FormikActions } from "formik"
import * as yup from 'yup'
import { connect } from "react-redux";

import "./styles.css"

import BottomLink from "../../components/BottomLink"
import logo from "../../assets/images/logo.svg"
import PublicOnlyPage from "../PublicOnlyPage"
import { ForgotPasswordForm, ForgotPasswordFormValue } from "./ForgotPasswordForm"
import { forgotPasswordAction } from "./actions"
import { AppThunkDispatch } from "../../stores"
import ActionToaster from "../../middlewares/ErrorToaster/ActionToaster"

export interface ForgotPasswordPage {
    dispatch: AppThunkDispatch
}

export class ForgotPasswordPage extends React.Component<ForgotPasswordPage> {
    
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
        return (
            <PublicOnlyPage>
                <div className="forgot-password-page">
                    <Link to="/">
                        <img src={logo} width={100} alt="logo" />
                    </Link>
                    <h1>Welcome To UGrade</h1>
                    <Divider />
                    <Formik
                        initialValues={this.initialValue}
                        validationSchema={this.validationSchema}
                        onSubmit={this.handleSubmit}
                        render={ForgotPasswordForm}
                    />
                    <BottomLink>
                        <Link to="/signup">Sign Up</Link>
                        <Link to="/signin">Sign In</Link>
                        <Link to="/setting">Setting</Link>
                    </BottomLink>
                </div>
            </PublicOnlyPage>
        )
    }
}

export default connect()(ForgotPasswordPage)