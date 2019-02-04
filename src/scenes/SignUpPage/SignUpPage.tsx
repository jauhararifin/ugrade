import React from "react"
import { FormGroup, InputGroup, Button, Intent, Divider, Card, Colors } from "@blueprintjs/core"
import { FormikProps, withFormik } from "formik"
import * as yup from 'yup'

import "@blueprintjs/core/lib/css/blueprint.css"

import "./styles.css"
import logo from "../../assets/images/logo.svg"
import { Link } from "react-router-dom"
import BottomLink from "../../components/BottomLink"

export interface SignUpFormValue {
  username?: string
  name?: string
  email?: string
  password: string
}

export interface SignUpPageProps extends FormikProps<SignUpFormValue>, SignUpFormValue {
}

const SignUpPage: React.SFC<SignUpPageProps> = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  errors,
  status,
  submitCount,
  isSubmitting
}) => (
  <div className="signup-page">
    <Link to="/">
        <img src={logo} width={100} alt="logo" />
    </Link>
    <h1>Welcome To UGrade</h1>
    <Divider />
    <Card className="signup-panel">
      <h2>Sign Up</h2>
      
      <form onSubmit={handleSubmit}>
        { status && !status.success && <h5 style={{ color: Colors.RED2 }}>{status.message}</h5>}
        <FormGroup
          helperText={submitCount > 0 && errors && errors.username}
          labelFor="signup-page-input-username"
          intent={submitCount && errors && errors.username ? Intent.DANGER : Intent.NONE}
        >
          <InputGroup
            name="username"
            id="signup-page-input-username"
            large
            placeholder="Username"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.username}/>
        </FormGroup>

        <FormGroup
          helperText={submitCount > 0 && errors && errors.name}
          labelFor="signup-page-input-name"
          intent={submitCount && errors && errors.name ? Intent.DANGER : Intent.NONE}
        >
          <InputGroup
            name="name"
            id="signup-page-input-name"
            large
            placeholder="Name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}/>
        </FormGroup>
        
        <FormGroup
          helperText={submitCount > 0 && errors && errors.email}
          labelFor="signup-page-input-email"
          intent={submitCount && errors && errors.email ? Intent.DANGER : Intent.NONE}
        >
          <InputGroup
            name="email"
            id="signup-page-input-email"
            type="email"
            large
            placeholder="Email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}/>
        </FormGroup>

        <FormGroup
          helperText={submitCount > 0 && errors && errors.password}
          labelFor="signup-page-input-password"
          intent={submitCount && errors && errors.password ? Intent.DANGER : Intent.NONE}
        >
          <InputGroup
            name="password" type="password"
            id="signup-page-input-password"
            large
            placeholder="Password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}/>
        </FormGroup>
        <Button type="submit" disabled={isSubmitting} fill large intent={Intent.SUCCESS}>
          { isSubmitting ? "Signing Up..." : "Sign Up" }
        </Button>
      </form>
    </Card>
    <BottomLink>
      <Link to="/signin">Sign In</Link>
      <Link to="/setting">Setting</Link>
    </BottomLink>
  </div>
)

const formik = withFormik<SignUpPageProps, SignUpFormValue>({
  mapPropsToValues: ({ username, name, email, password }) => ({
      username: username || '',
      name: name || '',
      email: email || '',
      password: password || '',
  }),
  validationSchema: yup.object().shape({
      username: yup.string().required(),
      email: yup.string().email().required(),
      name: yup.string().required(),
      password: yup.string().required(),
  }),
  handleSubmit: async (values, { props, setSubmitting, setStatus }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const status = {
          success: false,
          message: 'Username already taken',
      }
      setStatus(status)
      setSubmitting(false)
  },
})

export default formik(SignUpPage)
