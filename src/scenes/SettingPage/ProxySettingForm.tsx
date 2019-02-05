import React from 'react'
import { Divider, FormGroup, Label, InputGroup, Button, Intent } from "@blueprintjs/core"
import { FormikProps } from "formik"

export interface ProxySettingFormValue {
    host: string
    port: string
    username: string
    password: string
}

export interface ProxySettingFormProps extends FormikProps<ProxySettingFormValue> {
}

export const ProxySettingForm: React.SFC<ProxySettingFormProps> = ({
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
            <h3>Proxy Setting</h3>
            <Divider />
            <FormGroup
                label="Proxy Host"
                helperText={touched.host && errors && (errors.host || errors.port)}
                intent={touched.host && errors && (errors.host || errors.port) ? Intent.DANGER : Intent.NONE}
            >
                <Label>
                    <InputGroup name="host" placeholder="Host" onChange={handleChange} onBlur={handleBlur} value={values.host} />
                </Label>
                <Label>
                    <InputGroup name="port" placeholder="Port" onChange={handleChange} onBlur={handleBlur} value={values.port} />
                </Label>
            </FormGroup>
            <FormGroup
                label="Proxy Authentication"
                helperText={touched.host && errors && (errors.username || errors.password)}
                intent={touched.host && errors && (errors.username || errors.password) ? Intent.DANGER : Intent.NONE}
            >
                <Label>
                    <InputGroup name="username" placeholder="Username" onChange={handleChange} onBlur={handleBlur} value={values.username} />
                </Label>
                <Label>
                    <InputGroup type="password" name="password" placeholder="Password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
                </Label>
            </FormGroup>
            <div className="right">
                <Button type="submit" disabled={isSubmitting}>
                    { isSubmitting ? "Saving..." : "Save Proxy" }
                </Button>
            </div>
        </div>
    </form>
)

export default ProxySettingForm