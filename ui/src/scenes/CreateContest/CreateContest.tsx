import { usePublicOnly } from '@/auth'
import React, { FunctionComponent } from 'react'
import DocumentTitle from 'react-document-title'
import { CreateContestView } from './CreateContestView'

export const CreateContest: FunctionComponent = () => {
  usePublicOnly()
  return (
    <DocumentTitle title='UGrade | Create Contest'>
      <CreateContestView />
    </DocumentTitle>
  )
}
