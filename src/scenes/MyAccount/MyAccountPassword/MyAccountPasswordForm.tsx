import React from 'react'
import { Divider, FormGroup, Label, InputGroup, Button, Intent } from "@blueprintjs/core"
import { FormikProps } from "formik"

export interface MyAccountPasswordFormValue {
    oldPassword: string
    newPassword: string
    confirmation: string
}

export interface MyAccountPasswordFormProps extends FormikProps<MyAccountPasswordFormValue> {
}

export const MyAccountPasswordForm: React.SFC<MyAccountPasswordFormProps> = ({
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    errors,
    touched,
    isSubmitting
}) => (
    <form onSubmit={handleSubmit}>
        <div className="setting-page-content">
            <h3>Password</h3>
            <Divider />
            
            <FormGroup
                label="Your Old Password"
                helperText={touched.oldPassword && errors && (errors.oldPassword || errors.oldPassword)}
                intent={touched.oldPassword && errors && (errors.oldPassword || errors.oldPassword) ? Intent.DANGER : Intent.NONE}
            >
                <Label>
                    <InputGroup type="password" name="oldPassword" onChange={handleChange} onBlur={handleBlur} value={values.oldPassword} />
                </Label>
            </FormGroup>

            <FormGroup
                label="New Password"
                helperText={touched.newPassword && errors && (errors.newPassword || errors.newPassword)}
                intent={touched.newPassword && errors && (errors.newPassword || errors.newPassword) ? Intent.DANGER : Intent.NONE}
            >
                <Label>
                    <InputGroup type="password" name="newPassword" onChange={handleChange} onBlur={handleBlur} value={values.newPassword} />
                </Label>
            </FormGroup>

            <FormGroup
                label="Confirmation Password"
                helperText={touched.confirmation && errors && (errors.confirmation || errors.confirmation)}
                intent={touched.confirmation && errors && (errors.confirmation || errors.confirmation) ? Intent.DANGER : Intent.NONE}
            >
                <Label>
                    <InputGroup type="password" name="confirmation" placeholder="Repeat Your New Password" onChange={handleChange} onBlur={handleBlur} value={values.confirmation} />
                </Label>
            </FormGroup>

            <div className="right">
                <Button type="submit" disabled={isSubmitting}>
                    { isSubmitting ? "Saving..." : "Save Password" }
                </Button>
            </div>

        </div>
    </form>
)

export default MyAccountPasswordForm