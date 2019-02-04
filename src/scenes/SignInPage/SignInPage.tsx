import React from "react"
import { Divider, Card } from "@blueprintjs/core"
import { Formik } from 'formik'
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import * as yup from 'yup'

import "./styles.css"
import "@blueprintjs/core/lib/css/blueprint.css"

import BottomLink from "../../components/BottomLink"
import logo from "../../assets/images/logo.svg"
import SignInForm, { SignInFormValue } from "./SignInForm"
import { AuthenticationError } from "../../services/auth"
import { setTitle } from "../../reducers/title"

const initialValue: SignInFormValue = {
    username: '',
    password: '',
    rememberMe: false,
}

const validationSchema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
    rememberMe: yup.boolean()
})

interface SignInPageProps {
    dispatch: any
}

class SignInPage extends React.Component<SignInPageProps, any, any> {

    handleSubmit = (values: SignInFormValue, { setStatus, setSubmitting }: any) => {
        this.props.dispatch(async (dispatch: any, getState: any, { authService }: any) => {
            try {
                const token = await authService.login(values.username, values.password)
                dispatch(setTitle(token))
            } catch (error) {
                if (error instanceof AuthenticationError)
                    setStatus({ success: false, message: 'Wrong username or password'})
                else
                    throw error
            } finally {
                setSubmitting(false)
            }
        })
    }

    render() {
        console.log(this.props)
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
                        initialValues={initialValue}
                        validationSchema={validationSchema}
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

export default connect()(SignInPage)