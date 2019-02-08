import React, { SFC } from "react"
import { Divider } from "@blueprintjs/core"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import "./styles.css"

import logo from "../../assets/images/logo.svg"
import BottomLink from "../../components/BottomLink"
import { SignUpForm, SignUpFormProps } from "./SignUpForm"

export interface SignUpPageProps extends SignUpFormProps {
}

const SignUpPage: SFC<SignUpPageProps> = props => (
  <div className="plain-page">
    <div>
      <Link to="/">
          <img src={logo} width={100} alt="logo" />
      </Link>
      <h1>Welcome To UGrade</h1>
      <SignUpForm {...props} />
    </div>
    <BottomLink>
      <Link to="/signin">Sign In</Link>
      <Link to="/setting">Setting</Link>
    </BottomLink>
  </div>
)

export default connect()(SignUpPage)
