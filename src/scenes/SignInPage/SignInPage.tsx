import React from "react"
import { Divider, Card } from "@blueprintjs/core"
import { Formik, FormikActions } from 'formik'
import { connect } from "react-redux"
import { Link, Redirect } from "react-router-dom"
import * as yup from 'yup'

import "./styles.css"
import "@blueprintjs/core/lib/css/blueprint.css"

import BottomLink from "../../components/BottomLink"
import logo from "../../assets/images/logo.svg"
import SignInForm, { SignInFormValue } from "./SignInForm"
import { AppState, AppThunkDispatch } from "../../reducers"
import { signInAction } from "./action"
import ActionToaster from "../../middlewares/ErrorToaster/ActionToaster";

export interface SignInPageProps {
    signedIn: boolean
    dispatch: AppThunkDispatch
}

class SignInPage extends React.Component<SignInPageProps, {}> {

    initialValue: SignInFormValue = {
        username: '',
        password: '',
        rememberMe: false,
    }

    validationSchema = yup.object().shape({
        username: yup.string().required(),
        password: yup.string().required(),
        rememberMe: yup.boolean()
    })

    handleSubmit = (values: SignInFormValue, { setStatus, setSubmitting }: FormikActions<SignInFormValue>) => {
        this.props.dispatch(signInAction(values.username, values.password, values.rememberMe))
            .then(result => {
                setStatus(result)
                if (result.success)
                    ActionToaster.showSuccessToast('You Are Signed In')
            })
            .finally(() => setSubmitting(false))
    }

    render() {
        if (this.props.signedIn) {
            return <Redirect to='/contest' />
        }

        return (
            <div className="signin-page">
                <Link to="/">
                    <img src={logo} width={100} alt="logo" />
                </Link>
                <h1>Welcome To UGrade</h1>
                <Divider />
                <Card className="signin-panel">
                    <h2>Sign In</h2>
                    <Formik
                        initialValues={this.initialValue}
                        validationSchema={this.validationSchema}
                        onSubmit={this.handleSubmit}
                        render={SignInForm}
                    />
                </Card>
                <BottomLink>
                    <Link to="/signup">Sign Up</Link>
                    <Link to="/forgot-password">Forgot Password</Link>
                    <Link to="/setting">Setting</Link>
                </BottomLink>
            </div>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    signedIn: state.auth.isSignedIn
})

export default connect(mapStateToProps)(SignInPage)