import { useContest } from '@/contest'
import { useRouting } from '@/routing'
import gql from 'graphql-tag'
import { useApolloClient } from 'react-apollo-hooks'

export function useSetContest() {
  const client = useApolloClient()
  const contestStore = useContest()
  const routingStore = useRouting()
  return async (shortId: string) => {
    const result = await client.query({
      query: gql`
        query SetContest($shortId: String!) {
          contest: contestByShortId(shortId: $shortId) {
            id
          }
        }
      `,
      variables: { shortId },
    })
    contestStore.contestId = result.data.contest.id
    routingStore.push(`/enter-contest/${result.data.contest.id}/users`)
    return result
  }
}
