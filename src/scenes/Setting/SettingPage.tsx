import React, { SFC } from "react"
import { Link } from "react-router-dom"

import "./styles.css"

import BottomLink from "../../components/BottomLink"
import ProxySettingForm, { ProxySettingFormProps } from "./ProxySettingForm"

export interface SettingPageProps {
  proxyForm: ProxySettingFormProps
  showSignIn: boolean
  showSignUp: boolean
}

export const SettingPage: SFC<SettingPageProps> = ({ proxyForm, showSignIn, showSignUp}) => (
  <div className="setting-page">
    <div className="setting-page-panel">
      <div>
        <h2>Settings</h2>
      </div>
      <ProxySettingForm {...proxyForm} />
    </div>
    <BottomLink>
      <Link to="/">Home</Link>
      {showSignUp && <Link to="/signup">Sign Up</Link>}
      {showSignIn && <Link to="/signin">Sign In</Link>}
    </BottomLink>
  </div>
)

SettingPage.defaultProps = {
  showSignIn: true,
  showSignUp: true
}

export default SettingPage
