import React, { FunctionComponent } from 'react'
import { usePublicOnly } from 'ugrade/auth'
import { useTitle } from 'ugrade/common'
import { useLocation } from 'ugrade/router'
import { EnterContestView } from './EnterContestView'

export const EnterContest: FunctionComponent = () => {
  usePublicOnly()
  useTitle('UGrade | Enter Contest')
  const location = useLocation()
  return <EnterContestView location={location} />
}
