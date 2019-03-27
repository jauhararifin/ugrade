import lodash from 'lodash'
import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import { useAuth, useProblem } from '../../../../app'
import { Permission } from '../../../../auth'
import { showErrorToast, showSuccessToast, useContestOnly } from '../../../../common'
import { Problem } from '../../../../problem'
import { SimpleLoading } from '../../components/SimpleLoading'
import { ProblemListView } from './ProblemListView'

// TODO: add problem reordering
// TODO: add deleting indicator when delete problem
// TODO: Use more ui friendly disabled problem
export const ProblemList: FunctionComponent = () => {
  useContestOnly()
  const problemStore = useProblem()
  const authStore = useAuth()

  const handleDelete = async (problem: Problem) => {
    try {
      await problemStore.delete(problem.id)
      showSuccessToast(`Problem ${problem.name} Deleted`)
    } catch (error) {
      showErrorToast(error)
    }
  }

  const handleToggleDisable = async (problem: Problem) => {
    try {
      await problemStore.update({ ...problem, disabled: !problem.disabled })
      showSuccessToast(problem.disabled ? 'Problem Enabled' : 'Problem Disabled')
    } catch (error) {
      showErrorToast(error)
    }
  }

  return useObserver(() => {
    if (!problemStore.problems) {
      return <SimpleLoading />
    }
    const problems = lodash.values(problemStore.problems)
    const canCreate = authStore.can(Permission.CreateProblems)
    const canRead = authStore.can(Permission.ReadProblems)
    const canUpdate = authStore.can(Permission.UpdateProblems)
    const canDelete = authStore.can(Permission.DeleteProblems)
    return (
      <ProblemListView
        problems={problems}
        onDisable={handleToggleDisable}
        onDelete={handleDelete}
        canCreate={canCreate}
        canRead={canRead}
        canUpdate={canUpdate}
        canDelete={canDelete}
      />
    )
  })
}
