import { useContestOnly } from '@/auth'
import { BasicError } from '@/components/BasicError/BasicError'
import { showError } from '@/error'
import { useRouting } from '@/routing'
import { showSuccessToast } from '@/toaster'
import gql from 'graphql-tag'
import React, { FunctionComponent, useEffect } from 'react'
import { useMutation, useQuery } from 'react-apollo-hooks'
import { RouteComponentProps } from 'react-router'
import { SimpleLoading } from '../../components/SimpleLoading'
import { putItem } from '../../TopNavigationBar/Breadcrumbs/Breadcrumbs'
import { ProblemFormValue } from '../ProblemEditor/ProblemEditor'
import { ProblemDetail, ProblemDetailVariables } from './types/ProblemDetail'
import { UpdateProblem as UpdateProblemGQL, UpdateProblemVariables } from './types/UpdateProblem'
import { UpdateProblemView } from './UpdateProblemView'

export type UpdateProblemProps = RouteComponentProps<{ problemId: string }>

export const UpdateProblem: FunctionComponent<UpdateProblemProps> = ({ match }) => {
  useContestOnly()
  const routingStore = useRouting()

  const updateProblemMutate = useMutation<UpdateProblemGQL, UpdateProblemVariables>(gql`
    mutation UpdateProblem($problemId: ID!, $problem: ProblemModificationInput!) {
      updateProblem(problem: $problem, problemId: $problemId) {
        id
        shortId
        name
        statement
        disabled
        timeLimit
        tolerance
        memoryLimit
        outputLimit
      }
    }
  `)

  const { data, loading, error } = useQuery<ProblemDetail, ProblemDetailVariables>(
    gql`
      query ProblemDetail($problemId: ID!) {
        problem(problemId: $problemId) {
          id
          shortId
          name
          statement
          disabled
          timeLimit
          tolerance
          memoryLimit
          outputLimit
        }
      }
    `,
    { variables: { problemId: match.params.problemId } }
  )

  useEffect(() => {
    return putItem(`/contest/problems/${match.params.problemId}`, data && data.problem ? data.problem.name : '')
  }, [data && data.problem])

  const handleSubmit = async (value: ProblemFormValue) => {
    try {
      await updateProblemMutate({
        variables: {
          problemId: match.params.problemId,
          problem: value,
        },
      })
      showSuccessToast('Problem Updated')
    } catch (error) {
      showError(error)
    }
  }

  if (loading) return <SimpleLoading />
  if (error || !data || !data.problem) return <BasicError />
  return <UpdateProblemView problem={data.problem} onSubmit={handleSubmit} />
}
