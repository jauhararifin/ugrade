import { setToken } from '@/auth'
import { useMatch, useRouting } from '@/routing'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo-hooks'
import { SignUp, SignUpVariables } from './types/SignUp'

export interface SignUpInput {
  username: string
  name: string
  oneTimeCode: string
  password: string
}

export function useSignUp() {
  const routingStore = useRouting()
  const [, , userId] = useMatch(/enter-contest\/([0-9]+)\/users\/([0-9]+)/)
  const mutate = useMutation<SignUp, SignUpVariables>(gql`
    mutation SignUp($userId: ID!, $signupCode: String!, $user: UserInput!) {
      signUp(userId: $userId, signupCode: $signupCode, user: $user) {
        token
      }
    }
  `)

  return async (input: SignUpInput, rememberMe: boolean = false) => {
    const result = await mutate({
      variables: {
        userId,
        signupCode: input.oneTimeCode,
        user: input,
      },
    })
    const token = result.data.signUp.token
    setToken(token, rememberMe)
    routingStore.push('/contest')
    return result
  }
}
