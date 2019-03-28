import { useRouting } from '@/app'
import { title, usePublicOnly } from '@/common'
import React, { FunctionComponent } from 'react'
import { EnterContestView } from './EnterContestView'

export const EnterContest: FunctionComponent = () => {
  usePublicOnly()
  title('UGrade | Enter Contest')
  const routing = useRouting()
  return <EnterContestView location={routing.location} />
}
