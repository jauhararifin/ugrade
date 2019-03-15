import { Formik, FormikActions } from 'formik'
import React, { FunctionComponent } from 'react'
import { useContestOnly, useMe } from 'ugrade/auth'
import { User } from 'ugrade/auth/store'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { useMyProfile, useSetProfile } from 'ugrade/userprofile'
import { GenderType, ShirtSizeType } from 'ugrade/userprofile/store'
import * as yup from 'yup'
import { genderValues, shirtSizeValues } from './helpers'
import { MyAccountProfileFormView } from './MyAccountProfileFormView'

export interface MyAccountProfileFormValue {
  name: string
  gender?: GenderType
  address?: string
  shirtSize?: ShirtSizeType
}

export const MyAccountProfileForm: FunctionComponent = () => {
  useContestOnly()

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .label('Name')
      .required(),
    shirtSize: yup
      .string()
      .label('Shirt Size')
      .oneOf(shirtSizeValues),
    gender: yup
      .string()
      .label('Gender')
      .oneOf(genderValues),
    address: yup.string().label('Name'),
  })

  const setProfile = useSetProfile()

  const handleSubmit = async (
    values: MyAccountProfileFormValue,
    { setSubmitting }: FormikActions<MyAccountProfileFormValue>
  ) => {
    const { name, shirtSize, gender, address } = values
    try {
      await setProfile(
        name,
        shirtSize as ShirtSizeType,
        gender as GenderType,
        address
      )
      TopToaster.showSuccessToast('Profile Changed')
    } finally {
      setSubmitting(false)
    }
  }

  const me = useMe() as User
  const profile = useMyProfile()

  const initialValues = {
    name: me.name,
    gender: profile.gender,
    address: profile.address,
    shirtSize: profile.shirtSize,
  }
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      render={MyAccountProfileFormView}
    />
  )
}
