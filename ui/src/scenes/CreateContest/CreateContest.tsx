import React, { FunctionComponent } from 'react'
import { title } from '../../common'
import { CreateContestView } from './CreateContestView'

export const CreateContest: FunctionComponent = () => {
  title('UGrade | Create Contest')
  return <CreateContestView />
}
