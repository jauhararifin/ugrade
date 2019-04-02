import { useRouting } from '@/routing'
import gql from 'graphql-tag'
import { useApolloClient } from 'react-apollo-hooks'
import { SetContest, SetContestVariables } from './types/SetContest'

export function useSetContest() {
  const client = useApolloClient()
  const routingStore = useRouting()
  return async (shortId: string) => {
    const result = await client.query<SetContest, SetContestVariables>({
      query: gql`
        query SetContest($shortId: String!) {
          contest: contestByShortId(shortId: $shortId) {
            id
          }
        }
      `,
      variables: { shortId },
    })
    const contestId = result.data.contest.id
    routingStore.push(`/enter-contest/${contestId}/users`)
    return result
  }
}
