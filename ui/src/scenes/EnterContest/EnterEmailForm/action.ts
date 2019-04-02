import { useContest } from '@/contest'
import { useRouting } from '@/routing'
import gql from 'graphql-tag'
import { useApolloClient } from 'react-apollo-hooks'

export function useSetEmail() {
  const client = useApolloClient()
  const store = useContest()
  const routingStore = useRouting()
  return async (email: string) => {
    const result = await client.query({
      query: gql`
        query SetEmail($contestId: Int!, $email: String!) {
          user: userByEmail(contestId: $contestId, email: $email) {
            id
            username
          }
        }
      `,
      variables: { contestId: store.contestId, email },
    })
    store.userId = result.data.user.id

    if (result.data.user.username) {
      routingStore.push(`/enter-contest/${store.contestId}/users/${store.userId}/password`)
    } else {
      routingStore.push(`/enter-contest/${store.contestId}/users/${store.userId}/signup`)
    }

    return result
  }
}
