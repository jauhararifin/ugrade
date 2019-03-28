import { title } from '@/common'
import React, { FunctionComponent } from 'react'
import { CreateContestView } from './CreateContestView'

export const CreateContest: FunctionComponent = () => {
  title('UGrade | Create Contest')
  return <CreateContestView />
}
