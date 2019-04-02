import { useContest } from '@/contest'
import { useRouting } from '@/routing'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo-hooks'

export interface CreateContestInput {
  email: string
  shortId: string
  name: string
  shortDescription: string
}

export function useCreateContest() {
  const store = useContest()
  const routing = useRouting()
  const mutate = useMutation(
    gql`
      mutation CreateContest($email: String!, $shortId: String!, $name: String!, $shortDescription: String!) {
        createContest(contest: { name: $name, shortId: $shortId, shortDescription: $shortDescription }, email: $email) {
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
  return async (input: CreateContestInput) => {
    const result = await mutate({ variables: input })
    store.contestId = result.data.createContest.contest.id
    store.userId = result.data.createContest.admin.id
    routing.push(`/enter-contest/${store.contestId}/users/`)
    return result
  }
}
