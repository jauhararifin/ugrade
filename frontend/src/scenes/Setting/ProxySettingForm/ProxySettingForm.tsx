import { Formik, FormikActions } from 'formik'
import React, { FunctionComponent } from 'react'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { useProxySetting } from 'ugrade/settings'
import * as yup from 'yup'
import { ProxySettingFormView } from './ProxySettingFormView'

export interface ProxySettingFormValue {
  host: string
  port: string
  username: string
  password: string
}

export const ProxySettingForm: FunctionComponent = () => {
  const [proxySetting, setProxySetting] = useProxySetting()

  const initialValue = {
    ...proxySetting,
    port: (proxySetting.port || '').toString(),
  }

  const validationSchema = yup.object().shape({
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

  const handleSubmit = (
    values: ProxySettingFormValue,
    { setSubmitting }: FormikActions<ProxySettingFormValue>
  ) => {
    setProxySetting(values.host, values.port, values.username, values.password)
    setSubmitting(false)
    TopToaster.showSuccessToast('Proxy Setting Saved')
  }

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      component={ProxySettingFormView}
    />
  )
}
