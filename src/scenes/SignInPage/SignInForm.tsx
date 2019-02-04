import React from "react"
import { FormGroup, InputGroup, Switch, Button, Intent, Colors } from "@blueprintjs/core"
import { FormikProps, withFormik } from 'formik'

import "./styles.css"
import "@blueprintjs/core/lib/css/blueprint.css"

export interface SignInFormValue {
    username?: string
    password?: string
    rememberMe?: boolean
}

export interface SignInFormProps extends FormikProps<SignInFormValue>, SignInFormValue {
}

const SignInForm: React.SFC<SignInFormProps> = ({
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    status,
    submitCount,
    isSubmitting
}) => (
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
                <Switch checked={values.rememberMe} onChange={handleChange} onBlur={handleBlur} />
            </div>
        </div>
        <Button type="submit" disabled={isSubmitting} fill large intent={Intent.SUCCESS}>
            { isSubmitting ? "Signing In..." : "Sign In" }
        </Button>
    </form>
)

export default SignInForm