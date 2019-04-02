import { useMatch, useRouting } from '@/routing'
import gql from 'graphql-tag'
import { useApolloClient } from 'react-apollo-hooks'
import { SetEmail, SetEmailVariables } from './types/SetEmail'

export function useSetEmail() {
  const client = useApolloClient()
  const routingStore = useRouting()
  const [, contestId] = useMatch(/enter-contest\/([0-9]+)/)
  return async (email: string) => {
    const result = await client.query<SetEmail, SetEmailVariables>({
      query: gql`
        query SetEmail($contestId: ID!, $email: String!) {
          user: userByEmail(contestId: $contestId, email: $email) {
            id
            username
          }
        }
      `,
      variables: { contestId, email },
    })
    const userId = result.data.user.id

    if (result.data.user.username) {
      routingStore.push(`/enter-contest/${contestId}/users/${userId}/password`)
    } else {
      routingStore.push(`/enter-contest/${contestId}/users/${userId}/signup`)
    }

    return result
  }
}
