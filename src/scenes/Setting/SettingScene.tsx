import { Formik, FormikActions } from 'formik'
import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import * as yup from 'yup'

import ActionToaster from '../../middlewares/ErrorToaster/ActionToaster'
import { AppAction, AppState } from '../../stores'
import { setProxy } from '../../stores/Setting'
import { setTitle } from '../../stores/Title'
import {
  ProxySettingFormProps,
  ProxySettingFormValue,
} from './ProxySettingForm'
import SettingPage from './SettingPage'

export interface SettingSceneProps {
  dispatch: Dispatch<AppAction>
  proxyInitialValue: ProxySettingFormValue
  signedIn: boolean
}

export class SettingScene extends React.Component<SettingSceneProps> {
  proxyValidationSchema = yup.object().shape({
    host: yup.string(),
    port: yup
      .number()
      .max(65536)
      .min(0)
      .when('host', {
        is: host => !!host,
        then: yup.number().required(),
        otherwise: yup.number(),
      }),
    username: yup.string(),
    password: yup.string(),
  })

  componentDidMount() {
    this.props.dispatch(setTitle('UGrade | Settings'))
  }

  proxyHandleSubmit = (
    values: ProxySettingFormValue,
    { setSubmitting }: FormikActions<ProxySettingFormValue>
  ) => {
    this.props.dispatch(
      setProxy(values.host, values.port, values.username, values.password)
    )
    setSubmitting(false)
    ActionToaster.showSuccessToast('Proxy Setting Saved')
  }

  renderSettingPage = (props: ProxySettingFormProps) => {
    return (
      <SettingPage
        showSignIn={!this.props.signedIn}
        showSignUp={!this.props.signedIn}
        proxyForm={props}
      />
    )
  }

  render() {
    return (
      <Formik
        initialValues={this.props.proxyInitialValue}
        onSubmit={this.proxyHandleSubmit}
        validationSchema={this.proxyValidationSchema}
        render={this.renderSettingPage}
      />
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  proxyInitialValue: {
    host: state.setting.proxyHost,
    port: state.setting.proxyPort ? state.setting.proxyPort.toString() : '',
    username: state.setting.proxyUsername,
    password: state.setting.proxyPassword,
  },
  signedIn: state.auth.isSignedIn,
})

export default connect(mapStateToProps)(SettingScene)
