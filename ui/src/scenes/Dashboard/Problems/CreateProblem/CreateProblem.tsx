import { useContestOnly } from '@/auth'
import { showError } from '@/error'
import { useRouting } from '@/routing'
import { showSuccessToast } from '@/toaster'
import gql from 'graphql-tag'
import React, { FunctionComponent } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { ProblemFormValue } from '../ProblemEditor/ProblemEditor'
import { CreateProblemView } from './CreateProblemView'
import {
  CreateProblem as CreateProblemGQL,
  CreateProblemVariables as CreateProblemVariablesGQL,
} from './types/CreateProblem'

export const CreateProblem: FunctionComponent = () => {
  useContestOnly()
  const routingStore = useRouting()

  const createProblemMutate = useMutation<CreateProblemGQL, CreateProblemVariablesGQL>(
    gql`
      mutation CreateProblem($problem: ProblemInput!) {
        createProblem(problem: $problem) {
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
    {
      refetchQueries: [
        {
          query: gql`
            query GetProblemList {
              problems {
                id
              }
            }
          `,
        },
      ],
    }
  )

  const handleSubmit = async (value: ProblemFormValue) => {
    try {
      const newProb = await createProblemMutate({
        variables: { problem: value },
      })
      showSuccessToast('New Problem Created')
      routingStore.push(`/contest/problems/${newProb.data.createProblem.id}`)
    } catch (error) {
      showError(error)
    }
  }

  return <CreateProblemView onSubmit={handleSubmit} />
}
