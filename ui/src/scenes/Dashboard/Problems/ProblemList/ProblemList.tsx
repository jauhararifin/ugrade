import { useContestOnly } from '@/auth'
import { BasicError } from '@/components/BasicError/BasicError'
import { showError } from '@/error'
import { showSuccessToast } from '@/toaster'
import gql from 'graphql-tag'
import React, { FunctionComponent } from 'react'
import { useMutation, useQuery } from 'react-apollo-hooks'
import { SimpleLoading } from '../../components/SimpleLoading'
import {
  CreateProblemsPermission,
  DeleteProblemsPermission,
  ReadProblemsPermission,
  UpdateProblemsPermission,
} from '../../permissions'
import { useBreadcrumb } from '../../TopNavigationBar/Breadcrumbs/Breadcrumbs'
import { ProblemListView } from './ProblemListView'
import { GetProblemListAndMyPermissions } from './types/GetProblemListAndMyPermissions'

// TODO: add problem reordering
// TODO: add deleting indicator when delete problem
// TODO: Use more ui friendly disabled problem
export const ProblemList: FunctionComponent = () => {
  useContestOnly()
  useBreadcrumb(`/contest/problems`, 'Problems')

  const { data, loading, error } = useQuery<GetProblemListAndMyPermissions>(gql`
    query GetProblemListAndMyPermissions {
      problems {
        id
        name
        disabled
      }
      me {
        id
        permissions
      }
    }
  `)

  const deleteMutate = useMutation(
    gql`
      mutation DeleteProblem($problemId: ID!) {
        deleteProblem(problemId: $problemId)
      }
    `,
    {
      refetchQueries: [
        {
          query: gql`
            query GetProblemList {
              problems {
                id
                name
                disabled
              }
            }
          `,
        },
      ],
    }
  )

  const toggleDisable = useMutation(gql`
    mutation SetProblemDisabled($problemId: ID!, $disabled: Boolean!) {
      updateProblem(problemId: $problemId, problem: { disabled: $disabled }) {
        id
        disabled
      }
    }
  `)

  const handleDelete = async (problem: { id: string; name: string }) => {
    try {
      await deleteMutate({ variables: { problemId: problem.id } })
      showSuccessToast(`Problem ${problem.name} Deleted`)
    } catch (error) {
      showError(error)
    }
  }

  const handleToggleDisable = async (problem: { id: string; disabled: boolean }) => {
    try {
      await toggleDisable({ variables: { problemId: problem.id, disabled: !problem.disabled } })
      showSuccessToast(problem.disabled ? 'Problem Enabled' : 'Problem Disabled')
    } catch (error) {
      showError(error)
    }
  }

  if (loading) return <SimpleLoading />
  if (error || !data || !data.problems || !data.me) return <BasicError />

  const canCreate = data.me.permissions.includes(CreateProblemsPermission)
  const canRead = data.me.permissions.includes(ReadProblemsPermission)
  const canUpdate = data.me.permissions.includes(UpdateProblemsPermission)
  const canDelete = data.me.permissions.includes(DeleteProblemsPermission)
  return (
    <ProblemListView
      problems={data.problems}
      onDisable={handleToggleDisable}
      onDelete={handleDelete}
      canCreate={canCreate}
      canRead={canRead}
      canUpdate={canUpdate}
      canDelete={canDelete}
    />
  )
}
