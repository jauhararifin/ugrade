import React from "react"
import { FormGroup, InputGroup, Switch, Button, Intent, Divider, Card, Colors } from "@blueprintjs/core"
import { Link } from "react-router-dom"

import "./styles.css"
import "@blueprintjs/core/lib/css/blueprint.css"

import BottomLink from "../../components/BottomLink"
import logo from "../../assets/images/logo.svg"

const ForgotPasswordPage = () => (
    <div className="forgot-password-page">
        <Link to="/">
            <img src={logo} width={100} alt="logo" />
        </Link>
        <h1>Welcome To UGrade</h1>
        <Divider />
        <Card className="forgot-password-panel">
            <h2>Forgot Password</h2>
            <p>Enter your username or email. We'll email instruction on how to reset your password.</p>
            <FormGroup labelFor="forgot-password-input-username">
                <InputGroup
                    name="username"
                    large
                    id="forgot-password-input-username"
                    placeholder="Username Or Email" 
                />
            </FormGroup>
            <Button type="submit" fill large intent={Intent.SUCCESS}>
                Submit
            </Button>
        </Card>
        <BottomLink>
            <Link to="/signup">Sign Up</Link>
            <Link to="/signin">Sign In</Link>
            <Link to="/setting">Setting</Link>
        </BottomLink>
    </div>
)

export default ForgotPasswordPage