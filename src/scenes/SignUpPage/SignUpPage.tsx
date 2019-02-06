import React from "react"
import { Divider } from "@blueprintjs/core"
import { Formik, FormikActions } from "formik"
import { push } from "connected-react-router"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import * as yup from 'yup'

import "./styles.css"

import logo from "../../assets/images/logo.svg"
import BottomLink from "../../components/BottomLink"
import PublicOnlyPage from "../PublicOnlyPage"
import { SignUpForm, SignUpFormValue } from "./SignUpForm"
import { AppThunkDispatch } from "../../stores"
import { signUpAction } from "./actions"
import ActionToaster from "../../middlewares/ErrorToaster/ActionToaster"

export interface SignUpPageProps {
  dispatch: AppThunkDispatch
}

class SignUpPage extends React.Component<SignUpPageProps> {
  
  initialValues = {
    username: '',
    name: '',
    email: '',
    password: '',
  }

  validationSchema = yup.object().shape({
    username: yup.string().required(),
    email: yup.string().email().required(),
    name: yup.string().required(),
    password: yup.string().min(8).required(),
  })

  handleSubmit = (values: SignUpFormValue, { setSubmitting, setStatus }: FormikActions<SignUpFormValue>) => {
    this.props.dispatch(signUpAction(values.username, values.name, values.email, values.password))
      .then(result => {
        setStatus(result)
        if (result && result.success) {
          this.props.dispatch(push('/login'))
          ActionToaster.showSuccessToast("Your Account Successfully Created")
        }
      })
      .finally(() => setSubmitting(false))
  }

  render() {
    return (
      <PublicOnlyPage>
        <div className="signup-page">
          <Link to="/">
              <img src={logo} width={100} alt="logo" />
          </Link>
          <h1 onClick={() => this.props.dispatch(push('/signin'))}>Welcome To UGrade</h1>
          <Divider />
          <Formik
            validationSchema={this.validationSchema}
            onSubmit={this.handleSubmit}
            initialValues={this.initialValues}
            render={SignUpForm} />
          <BottomLink>
            <Link to="/signin">Sign In</Link>
            <Link to="/setting">Setting</Link>
          </BottomLink>
        </div>
      </PublicOnlyPage>
    )
  }
}

export default connect()(SignUpPage)
