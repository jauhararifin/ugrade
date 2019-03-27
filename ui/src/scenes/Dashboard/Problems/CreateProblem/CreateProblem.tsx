import React, { FunctionComponent } from 'react'
import { useProblem } from '../../../../app'
import { showErrorToast, showSuccessToast } from '../../../../common'
import { ProblemFormValue } from '../ProblemEditor'
import { CreateProblemView } from './CreateProblemView'

export const CreateProblem: FunctionComponent = () => {
  const problemStore = useProblem()

  const handleSubmit = async (value: ProblemFormValue) => {
    try {
      await problemStore.create({
        id: '',
        ...value,
      })
      showSuccessToast('New Problem Created')
    } catch (error) {
      showErrorToast(error)
    }
  }

  return <CreateProblemView onSubmit={handleSubmit} />
}
