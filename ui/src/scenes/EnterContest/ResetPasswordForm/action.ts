import { useContest } from '@/contest'
import { useRouting } from '@/routing'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo-hooks'

export function useResetPassword() {
  const contestStore = useContest()
  const routingStore = useRouting()
  const mutate = useMutation(gql`
    mutation ResetPassword($userId: Int!, $resetPasswordOtc: String!, $password: String!) {
      resetPassword(userId: $userId, resetPasswordOtc: $resetPasswordOtc, newPassword: $password) {
        id
      }
    }
  `)
  return async (resetPasswordOtc: string, password: string) => {
    await mutate({
      variables: { userId: contestStore.userId, password, resetPasswordOtc },
    })
    routingStore.push(`/enter-contest/${contestStore.contestId}/users/${contestStore.userId}/password`)
  }
}
