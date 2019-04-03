import { useContestOnly } from '@/auth'
import { BasicError } from '@/components/BasicError/BasicError'
import gql from 'graphql-tag'
import React, { FunctionComponent } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { RouteComponentProps } from 'react-router'
import { SimpleLoading } from '../../components/SimpleLoading'
import { ProblemDetailView } from './ProblemDetailView'
import { GetProblemStatement, GetProblemStatementVariables } from './types/GetProblemStatement'

export type ProblemDetailProps = RouteComponentProps<{ problemId: string }>

export const ProblemDetail: FunctionComponent<ProblemDetailProps> = ({ match }) => {
  useContestOnly()

  const { data, loading, error } = useQuery<GetProblemStatement, GetProblemStatementVariables>(
    gql`
      query GetProblemStatement($problemId: ID!) {
        problem(problemId: $problemId) {
          id
          name
          statement
        }
      }
    `,
    {
      variables: {
        problemId: match.params.problemId,
      },
    }
  )

  if (loading) return <SimpleLoading />
  if (error || !data || !data.problem) return <BasicError />
  return <ProblemDetailView problem={data.problem} />
}
