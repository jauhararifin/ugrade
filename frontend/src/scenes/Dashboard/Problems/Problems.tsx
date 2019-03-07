import React, { FunctionComponent } from 'react'
import { useContestOnly, usePermissions } from 'ugrade/auth'
import { UserPermission } from 'ugrade/auth/store'
import { handleCommonError } from 'ugrade/common'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { useDeleteProblem, useProblemList } from 'ugrade/contest/problem'
import { Problem } from 'ugrade/contest/store'
import { ProblemsLoadingView } from './ProblemsLoadingView'
import { ProblemsView } from './ProblemsView'

export const Problems: FunctionComponent = () => {
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

  const loading =
    !problems ||
    canCreate === undefined ||
    canRead === undefined ||
    canUpdate === undefined ||
    canDelete === undefined
  if (loading) return <ProblemsLoadingView />

  return (
    <ProblemsView
      problems={problems as Problem[]}
      onDelete={handleDelete}
      canCreate={canCreate}
      canRead={canRead}
      canUpdate={canUpdate}
      canDelete={canDelete}
    />
  )
}
