import React from "react"
import { Link } from "react-router-dom"
import { Formik, FormikActions } from "formik"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as yup from 'yup'

import "./styles.css"

import BottomLink from "../../components/BottomLink"
import ProxySettingForm, { ProxySettingFormValue } from "./ProxySettingForm"
import { AppState } from "../../reducers"
import { setProxy } from "../../reducers/Setting"
import ActionToaster from "../../middlewares/ErrorToaster/ActionToaster"

export interface SettingPageProps {
  dispatch: Dispatch<AppState>
  proxyInitialValue: ProxySettingFormValue
}

export class SettingPage extends React.Component<SettingPageProps> {

  proxyValidationSchema = yup.object().shape({
    host: yup.string(),
    port: yup.number().max(65536).min(0).when('host', {
      is: host => !!host,
      then: yup.number().required(),
      otherwise: yup.number()
    }),
    username: yup.string(),
    password: yup.string()
  })

  proxyHandleSubmit = (values: ProxySettingFormValue, { setSubmitting }: FormikActions<ProxySettingFormValue>) => {
    this.props.dispatch(setProxy(values.host, values.port, values.username, values.password))
    setSubmitting(false)
    ActionToaster.showSuccessToast("Proxy Setting Saved")
  }

  render() {
    return (
      <div className="setting-page">
        <div className="setting-page-panel">
          <div>
            <h2>Settings</h2>
          </div>
          <Formik
            initialValues={this.props.proxyInitialValue}
            validationSchema={this.proxyValidationSchema}
            onSubmit={this.proxyHandleSubmit}
            render={ProxySettingForm}
          />
        </div>
        <BottomLink>
          <Link to="/signup">Sign Up</Link>
          <Link to="/signin">Sign In</Link>
        </BottomLink>
      </div>
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  proxyInitialValue: {
    host: state.setting.proxyHost,
    port: state.setting.proxyPort ? state.setting.proxyPort.toString() : '',
    username: state.setting.proxyUsername,
    password: state.setting.proxyPassword,
  }
})

export default connect(mapStateToProps, null)(SettingPage)
