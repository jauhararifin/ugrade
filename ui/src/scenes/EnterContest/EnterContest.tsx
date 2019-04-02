import { usePublicOnly } from '@/auth'
import { useRouting } from '@/routing'
import { title } from '@/window'
import React, { FunctionComponent } from 'react'
import { EnterContestView } from './EnterContestView'

export const EnterContest: FunctionComponent = () => {
  usePublicOnly()
  title('UGrade | Enter Contest')
  const routing = useRouting()
  return <EnterContestView location={routing.location} />
}
