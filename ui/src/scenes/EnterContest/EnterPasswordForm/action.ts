import { setToken } from '@/auth'
import { useContest } from '@/contest'
import { useRouting } from '@/routing'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo-hooks'

export function useSignIn() {
  const contestStore = useContest()
  const routingStore = useRouting()
  const mutate = useMutation(gql`
    mutation SignIn($userId: Int!, $password: String!) {
      signIn(userId: $userId, password: $password) {
        token
      }
    }
  `)
  return async (password: string, rememberMe: boolean = false) => {
    const result = await mutate({
      variables: { userId: contestStore.userId, password },
    })
    const token = result.data.signIn.token
    setToken(token, rememberMe)
    routingStore.push('/contest')
    return result
  }
}

export function useForgotPassword() {
  const contestStore = useContest()
  const routingStore = useRouting()
  const mutate = useMutation(gql`
    mutation ForgotPassword($userId: Int!) {
      forgotPassword(userId: $userId) {
        id
      }
    }
  `)
  return async () => {
    await mutate({ variables: { userId: contestStore.userId } })
    routingStore.push(`/enter-contest/${contestStore.contestId}/users/${contestStore.userId}/reset-password`)
  }
}
