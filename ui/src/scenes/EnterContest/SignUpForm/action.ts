import { setToken } from '@/auth'
import { useContest } from '@/contest'
import { useRouting } from '@/routing'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo-hooks'

export interface SignUpInput {
  username: string
  name: string
  oneTimeCode: string
  password: string
}

export function useSignUp() {
  const contestStore = useContest()
  const routingStore = useRouting()
  const mutate = useMutation(gql`
    mutation SignUp($userId: Int!, $signupCode: String!, $username: String!, $name: String!, $password: String!) {
      signUp(
        userId: $userId
        signupCode: $signupCode
        user: { username: $username, name: $name, password: $password }
      ) {
        token
      }
    }
  `)

  return async (input: SignUpInput, rememberMe: boolean = false) => {
    const result = await mutate({
      variables: {
        userId: contestStore.userId,
        signupCode: input.oneTimeCode,
        username: input.username,
        name: input.name,
        password: input.password,
      },
    })
    const token = result.data.signUp.token
    setToken(token, rememberMe)
    routingStore.push('/contest')
    return result
  }
}
