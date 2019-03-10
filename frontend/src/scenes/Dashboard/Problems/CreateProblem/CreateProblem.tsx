import React, { FunctionComponent } from 'react'
import { handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { useCreateProblem } from 'ugrade/contest/problem'
import { ProblemFormValue } from '../ProblemEditor'
import { CreateProblemView } from './CreateProblemView'

export const CreateProblem: FunctionComponent = () => {
  const createProblem = useCreateProblem()

  const handleSubmit = async (value: ProblemFormValue) => {
    try {
      await createProblem(
        value.shortId,
        value.name,
        value.statement,
        value.type,
        value.disabled,
        value.timeLimit,
        value.tolerance,
        value.memoryLimit,
        value.outputLimit
      )
      TopToaster.showSuccessToast('New Problem Created')
    } catch (error) {
      if (!handleCommonError(error)) throw error
    }
  }

  return <CreateProblemView onSubmit={handleSubmit} />
}
