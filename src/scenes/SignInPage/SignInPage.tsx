import React from "react"
import { FormGroup, InputGroup, Switch, Button, Intent, Divider, Card, Colors } from "@blueprintjs/core"
import { FormikProps, withFormik } from 'formik'
import { Link } from "react-router-dom"
import * as yup from 'yup'

import "./styles.css"
import "@blueprintjs/core/lib/css/blueprint.css"

import BottomLink from "../../components/BottomLink"
import logo from "../../assets/images/logo.svg"

export interface SignInFormValue {
    username?: string
    password?: string
    rememberMe?: boolean
}

export interface SignInPageProps extends FormikProps<SignInFormValue>, SignInFormValue {
}

const SignInPage: React.SFC<SignInPageProps> = ({
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    status,
    submitCount,
    isSubmitting
}) => (
  <div className="signin-page">
    <Link to="/">
        <img src={logo} width={100} alt="logo" />
    </Link>
    <h1>Welcom To UGrade</h1>
    <Divider />
    <Card className="signin-panel">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        { status && !status.success && <h5 style={{ color: Colors.RED2 }}>{status.message}</h5>}
        <FormGroup
            helperText={submitCount > 0 && errors && errors.username}
            labelFor="signin-input-username"
            intent={submitCount && errors && errors.username ? Intent.DANGER : Intent.NONE}
        >
            <InputGroup
                name="username"
                large
                id="signin-input-username"
                placeholder="Username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        </FormGroup>
        <FormGroup
            helperText={submitCount > 0 && errors && errors.password}
            labelFor="signin-input-passowrd"
            intent={submitCount && errors && errors.password ? Intent.DANGER : Intent.NONE}
        >
            <InputGroup
                name="password"
                large
                id="signin-input-password"
                placeholder="Password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        </FormGroup>
        <div className="remember-me">
            <div>Remember Me</div>
            <div>
                <Switch checked={values.rememberMe} />
            </div>
        </div>
        <Button type="submit" disabled={isSubmitting} fill large intent={Intent.SUCCESS}>
            { isSubmitting ? "Signing In..." : "Sign In" }
        </Button>
      </form>
    </Card>
    <BottomLink>
        <Link to="/signup">Sign Up</Link>
        <Link to="/forgot-password">Forgot Password</Link>
        <Link to="/setting">Setting</Link>
    </BottomLink>
  </div>
);

const formik = withFormik<SignInPageProps, SignInFormValue>({
    mapPropsToValues: ({username, password}) => ({
        username: username || '',
        password: password || '',
    }),
    validationSchema: yup.object().shape({
        username: yup.string().required(),
        password: yup.string().required(),
        rememberMe: yup.boolean()
    }),
    handleSubmit: async (values, { props, setSubmitting, setStatus }) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const status = {
            success: false,
            message: 'Wrong username or password',
        }
        setStatus(status)
        setSubmitting(false)
    },
})

export default formik(SignInPage)