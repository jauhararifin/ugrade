import React, { SFC } from "react"
import { Link } from "react-router-dom"

import "./styles.css"

import BottomLink from "../../components/BottomLink"
import logo from "../../assets/images/logo.svg"
import { ForgotPasswordForm, ForgotPasswordFormProps } from "./ForgotPasswordForm"

export interface ForgotPasswordPageProps extends ForgotPasswordFormProps {
}

export const ForgotPasswordPage: SFC<ForgotPasswordPageProps> = (props) => (
    <div className="plain-page">
        <div>
            <Link to="/">
                <img src={logo} width={100} alt="logo" />
            </Link>
            <h1>Welcome To UGrade</h1>
            <ForgotPasswordForm {...props} />
        </div>
        <BottomLink>
            <Link to="/signup">Sign Up</Link>
            <Link to="/signin">Sign In</Link>
            <Link to="/setting">Setting</Link>
        </BottomLink>
    </div>
)

export default ForgotPasswordPage