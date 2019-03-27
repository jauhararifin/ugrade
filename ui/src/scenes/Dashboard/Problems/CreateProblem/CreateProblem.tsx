import React, { FunctionComponent } from 'react'
import { useProblem, useRouting } from '../../../../app'
import { showErrorToast, showSuccessToast } from '../../../../common'
import { ProblemFormValue } from '../ProblemEditor'
import { CreateProblemView } from './CreateProblemView'

export const CreateProblem: FunctionComponent = () => {
  const problemStore = useProblem()
  const routingStore = useRouting()

  const handleSubmit = async (value: ProblemFormValue) => {
    try {
      const newProb = await problemStore.create({
        id: '',
        ...value,
      })
      showSuccessToast('New Problem Created')
      routingStore.push(`/contest/problems/${newProb.id}`)
    } catch (error) {
      showErrorToast(error)
    }
  }

  return <CreateProblemView onSubmit={handleSubmit} />
}
