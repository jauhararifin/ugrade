import { usePublicOnly } from '@/auth'
import { useRouting } from '@/routing'
import React, { FunctionComponent } from 'react'
import DocumentTitle from 'react-document-title'
import { EnterContestView } from './EnterContestView'

export const EnterContest: FunctionComponent = () => {
  usePublicOnly()
  const routing = useRouting()
  return (
    <DocumentTitle title='UGrade | Enter Contest'>
      <EnterContestView location={routing.location} />
    </DocumentTitle>
  )
}
