import React, { FunctionComponent } from 'react'
import { ContentWithHeader } from '../components/ContentWithHeader/ContentWithHeader'
import { ContestInfoForm } from './ContestInfoForm/ContestInfoForm'

export const SettingsView: FunctionComponent = () => {
  return (
    <ContentWithHeader className='contest-settings' header='Contest Settings'>
      <ContestInfoForm />
    </ContentWithHeader>
  )
}
