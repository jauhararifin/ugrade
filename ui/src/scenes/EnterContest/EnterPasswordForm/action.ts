import { setToken } from '@/auth'
import { useRouting } from '@/routing'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo-hooks'
import { ForgotPassword, ForgotPasswordVariables } from './types/ForgotPassword'
import { SignIn, SignInVariables } from './types/SignIn'

export function useSignIn(userId: string) {
  const routingStore = useRouting()
  const mutate = useMutation<SignIn, SignInVariables>(gql`
    mutation SignIn($userId: ID!, $password: String!) {
      signIn(userId: $userId, password: $password) {
        token
      }
    }
  `)
  return async (password: string, rememberMe: boolean = false) => {
    const result = await mutate({
      variables: { userId, password },
    })
    const token = result.data.signIn.token
    setToken(token, rememberMe)
    routingStore.push('/contest')
    return result
  }
}

export function useForgotPassword(contestId: string, userId: string) {
  const routingStore = useRouting()
  const mutate = useMutation<ForgotPassword, ForgotPasswordVariables>(gql`
    mutation ForgotPassword($userId: ID!) {
      forgotPassword(userId: $userId) {
        id
      }
    }
  `)
  return async () => {
    await mutate({ variables: { userId } })
    routingStore.push(`/enter-contest/${contestId}/users/${userId}/reset-password`)
  }
}
