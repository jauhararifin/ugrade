import { Formik, FormikActions } from 'formik'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import * as yup from 'yup'

import ActionToaster from '../../../helpers/ActionToaster/ActionToaster'
import { AppState } from '../../../stores'
import { setProxy } from '../../../stores/Setting'
import { ProxySettingFormView } from './ProxySettingFormView'

export interface ProxySettingFormValue {
  host: string
  port: string
  username: string
  password: string
}

export interface ProxySettingFormProps {
  dispatch: Dispatch
  initialValue: ProxySettingFormValue
}

export class ProxySettingForm extends Component<ProxySettingFormProps> {
  validationSchema = yup.object().shape({
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

  handleSubmit = (
    values: ProxySettingFormValue,
    { setSubmitting }: FormikActions<ProxySettingFormValue>
  ) => {
    this.props.dispatch(
      setProxy(values.host, values.port, values.username, values.password)
    )
    setSubmitting(false)
    ActionToaster.showSuccessToast('Proxy Setting Saved')
  }

  render() {
    return (
      <Formik
        initialValues={this.props.initialValue}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
        component={ProxySettingFormView}
      />
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  initialValue: {
    host: state.setting.proxyHost,
    port: state.setting.proxyPort ? state.setting.proxyPort.toString() : '',
    username: state.setting.proxyUsername,
    password: state.setting.proxyPassword,
  },
})

export default connect(mapStateToProps)(ProxySettingForm)
