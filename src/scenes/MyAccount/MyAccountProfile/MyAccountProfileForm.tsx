import React from 'react'
import { Divider, FormGroup, Label, InputGroup, Button, Intent, HTMLSelect, TextArea } from "@blueprintjs/core"
import { FormikProps } from "formik"

import { GenderType, ShirtSizeType } from '../../../stores/Auth'
import { genderToString, shirtSizeToString, genderValues, shirtSizeValues } from './helpers'

export interface MyAccountProfileFormValue {
    name: string
    gender?: GenderType
    address?: string
    shirtSize?: ShirtSizeType
}

export interface MyAccountProfileFormProps extends FormikProps<MyAccountProfileFormValue> {
}

export const MyAccountProfileForm: React.SFC<MyAccountProfileFormProps> = ({
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
            <h3>Account Profile</h3>
            <Divider />
            
            <FormGroup
                label="Name"
                helperText={touched.name && errors && (errors.name || errors.name)}
                intent={touched.name && errors && (errors.name || errors.name) ? Intent.DANGER : Intent.NONE}
            >
                <InputGroup name="name" onChange={handleChange} onBlur={handleBlur} value={values.name} />
            </FormGroup>

            <FormGroup
                label="Gender"
                helperText={touched.gender && errors && (errors.gender || errors.gender)}
                intent={touched.gender && errors && (errors.gender || errors.gender) ? Intent.DANGER : Intent.NONE}
            >
                <HTMLSelect
                    name="gender"
                    fill
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={genderToString(values.gender)}
                    options={genderValues} />
            </FormGroup>

            <FormGroup
                label="Shirt Size"
                helperText={touched.shirtSize && errors && (errors.shirtSize || errors.shirtSize)}
                intent={touched.shirtSize && errors && (errors.shirtSize || errors.shirtSize) ? Intent.DANGER : Intent.NONE}
            >
                <HTMLSelect
                    name="shirtSize"
                    fill
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={shirtSizeToString(values.shirtSize)}
                    options={shirtSizeValues} />
            </FormGroup>

            <FormGroup
                label="Address"
                helperText={touched.address && errors && (errors.address || errors.address)}
                intent={touched.address && errors && (errors.address || errors.address) ? Intent.DANGER : Intent.NONE}
            >
                <TextArea name="address" fill onChange={handleChange} onBlur={handleBlur} value={values.address} />
            </FormGroup>

            <div className="right">
                <Button type="submit" disabled={isSubmitting}>
                    { isSubmitting ? "Saving..." : "Save Profile" }
                </Button>
            </div>

        </div>
    </form>
)

export default MyAccountProfileForm