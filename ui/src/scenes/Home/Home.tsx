import { usePublicOnly } from '@/auth'
import React, { FunctionComponent } from 'react'
import DocumentTitle from 'react-document-title'
import { HomeView } from './HomeView'

export const Home: FunctionComponent = () => {
  usePublicOnly()
  return (
    <DocumentTitle title='UGrade | Home'>
      <HomeView />
    </DocumentTitle>
  )
}
