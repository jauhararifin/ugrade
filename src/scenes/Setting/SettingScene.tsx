import React from "react"
import { FormikActions, Formik } from "formik"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as yup from 'yup'

import { ProxySettingFormValue } from "./ProxySettingForm"
import { AppState, AppAction } from "../../stores"
import { setProxy } from "../../stores/Setting"
import ActionToaster from "../../middlewares/ErrorToaster/ActionToaster"
import SettingPage from "./SettingPage"

export interface SettingSceneProps {
  dispatch: Dispatch<AppAction>
  proxyInitialValue: ProxySettingFormValue
  signedIn: boolean
}

export class SettingScene extends React.Component<SettingSceneProps> {

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
    return <Formik
      initialValues={this.props.proxyInitialValue}
      onSubmit={this.proxyHandleSubmit}
      validationSchema={this.proxyValidationSchema}
      render={props => <SettingPage showSignIn={!this.props.signedIn} showSignUp={!this.props.signedIn} proxyForm={props}/>}
    />
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

export default connect(mapStateToProps, null)(SettingScene)
