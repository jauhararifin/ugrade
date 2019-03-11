import React, { FunctionComponent } from 'react'
import { useContestOnly, usePermissions } from 'ugrade/auth'
import { UserPermission } from 'ugrade/auth/store'
import { handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import {
  useDeleteProblem,
  useProblemList,
  useUpdateProblem,
} from 'ugrade/contest/problem'
import { Problem } from 'ugrade/contest/store'
import { SimpleLoading } from '../../components/SimpleLoading'
import { ProblemListView } from './ProblemListView'

// TODO: add problem reordering
export const ProblemList: FunctionComponent = () => {
  useContestOnly()
  const problems = useProblemList()

  const canCreate = usePermissions([UserPermission.ProblemsCreate])
  const canRead = usePermissions([UserPermission.ProblemsRead])
  const canUpdate = usePermissions([UserPermission.ProblemsUpdate])
  const canDelete = usePermissions([UserPermission.ProblemsDelete])

  const deleteProblem = useDeleteProblem()
  const handleDelete = async (problem: Problem) => {
    try {
      await deleteProblem(problem.id)
      TopToaster.showSuccessToast(`Problem ${problem.name} Deleted`)
    } catch (error) {
      if (!handleCommonError(error)) throw error
    }
  }

  const updateProblem = useUpdateProblem()
  const handleToggleDisable = async (problem: Problem) => {
    try {
      await updateProblem(
        problem.id,
        undefined,
        undefined,
        undefined,
        undefined,
        !problem.disabled
      )
      TopToaster.showSuccessToast(
        problem.disabled ? 'Problem Enabled' : 'Problem Disabled'
      )
    } catch (error) {
      if (!handleCommonError(error)) throw error
    }
  }

  if (!problems) {
    return <SimpleLoading />
  }

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
}
