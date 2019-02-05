import React from 'react'
import { FormikProps } from "formik"
import { Card, FormGroup, InputGroup, Button, Intent } from "@blueprintjs/core"

export interface ForgotPasswordFormValue {
    usernameOrEmail: string
}

export interface ForgotPasswordFormProps extends FormikProps<ForgotPasswordFormValue> {
}

export const ForgotPasswordForm: React.SFC<ForgotPasswordFormProps> = ({
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    errors,
    submitCount,
    isSubmitting
}) => (
    <form onSubmit={handleSubmit}>
        <Card className="forgot-password-panel">
            <h2>Forgot Password</h2>
            <p>Enter your username or email. We'll email instruction on how to reset your password.</p>
            <FormGroup
                labelFor="forgot-password-input-username"
                helperText={submitCount > 0 && errors && errors.usernameOrEmail}
                intent={submitCount && errors && errors.usernameOrEmail ? Intent.DANGER : Intent.NONE}
            >
                <InputGroup
                    name="usernameOrEmail"
                    id="forgot-password-input-username"
                    large
                    placeholder="Username Or Email"
                    autoFocus
                    value={values.usernameOrEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </FormGroup>
            <Button type="submit" fill large intent={Intent.SUCCESS} disabled={isSubmitting}>
                { isSubmitting ? "Submitting..." : "Submit" }
            </Button>
        </Card>
    </form>
)