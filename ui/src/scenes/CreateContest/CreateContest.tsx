import { title } from '@/window'
import React, { FunctionComponent } from 'react'
import { usePublicOnly } from '../../auth'
import { CreateContestView } from './CreateContestView'

export const CreateContest: FunctionComponent = () => {
  usePublicOnly()
  title('UGrade | Create Contest')
  return <CreateContestView />
}
