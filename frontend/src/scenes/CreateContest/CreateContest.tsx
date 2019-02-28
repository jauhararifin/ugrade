import React, { FunctionComponent } from 'react'
import { usePublicOnly } from 'ugrade/auth'
import { useTitle } from 'ugrade/common'
import { CreateContestView } from './CreateContestView'

export const CreateContest: FunctionComponent = () => {
  usePublicOnly()
  useTitle('UGrade | Create Contest')
  return <CreateContestView />
}
