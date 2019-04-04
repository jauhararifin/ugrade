import { BasicError } from '@/components/BasicError/BasicError'
import gql from 'graphql-tag'
import React, { FunctionComponent } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { RouteComponentProps } from 'react-router'
import { SimpleLoading } from '../../components/SimpleLoading'
import { UpdateUsersPermissionsPermission } from '../../permissions'
import { MemberDetailView } from './MemberDetailView'
import {
  GetMyPermissionsAndSpecificUser,
  GetMyPermissionsAndSpecificUserVariables,
} from './types/GetMyPermissionsAndSpecificUser'

export type MemberDetailProps = RouteComponentProps<{ userId: string }>

export const MemberDetail: FunctionComponent<MemberDetailProps> = ({ match }) => {
  const { data, loading, error } = useQuery<GetMyPermissionsAndSpecificUser, GetMyPermissionsAndSpecificUserVariables>(
    gql`
      query GetMyPermissionsAndSpecificUser($userId: ID!) {
        me {
          id
          permissions
        }
        user(userId: $userId) {
          id
          username
          name
          email
          permissions
        }
      }
    `,
    {
      variables: {
        userId: match.params.userId,
      },
    }
  )

  if (loading) return <SimpleLoading />
  if (error || !data || !data.me || !data.user) return <BasicError />

  const canUpdatePermission = data.me.permissions.includes(UpdateUsersPermissionsPermission)
  const user = data.user

  if (!user) return <SimpleLoading />
  return <MemberDetailView user={user} canUpdatePermission={canUpdatePermission} />
}
