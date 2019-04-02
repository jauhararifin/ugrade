import { useRouting } from '@/routing'
import { FetchResult } from 'apollo-link'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo-hooks'
import { CreateContest, CreateContestVariables } from './types/CreateContest'

export function useCreateContest() {
  const routing = useRouting()
  const mutate = useMutation<CreateContest, CreateContestVariables>(
    gql`
      mutation CreateContest($email: String!, $contest: ContestInput!) {
        createContest(contest: $contest, email: $email) {
          admin {
            id
          }
          contest {
            id
          }
        }
      }
    `
  )
  return async (input: CreateContestVariables) => {
    const result: FetchResult<CreateContest> = await mutate({ variables: input })
    const contestId = result.data.createContest.contest.id
    const userId = result.data.createContest.admin.id
    routing.push(`/enter-contest/${contestId}/users/${userId}/password`)
    return result
  }
}
