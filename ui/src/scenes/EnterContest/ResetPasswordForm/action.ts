import { useRouting } from '@/routing'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo-hooks'
import { ResetPassword, ResetPasswordVariables } from './types/ResetPassword'

export function useResetPassword(contestId: string, userId: string) {
  const routingStore = useRouting()
  const mutate = useMutation<ResetPassword, ResetPasswordVariables>(gql`
    mutation ResetPassword($userId: ID!, $resetPasswordOtc: String!, $password: String!) {
      resetPassword(userId: $userId, resetPasswordOtc: $resetPasswordOtc, newPassword: $password) {
        id
      }
    }
  `)
  return async (resetPasswordOtc: string, password: string) => {
    await mutate({
      variables: { userId, password, resetPasswordOtc },
    })
    routingStore.push(`/enter-contest/${contestId}/users/${userId}/password`)
  }
}
