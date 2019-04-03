import { BasicError } from '@/components/BasicError/BasicError'
import gql from 'graphql-tag'
import React, { FunctionComponent } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { SimpleLoading } from '../../components/SimpleLoading'
import { InviteUsersPermission } from '../../permissions'
import { MemberListView } from './MemberListView'
import { GetMembersAndMyPermissions } from './types/GetMembersAndMyPermissions'

export const MemberList: FunctionComponent = () => {
  const { data, loading, error } = useQuery<GetMembersAndMyPermissions>(gql`
    query GetMembersAndMyPermissions {
      me {
        id
        permissions
      }
      myContest {
        id
        members {
          id
          name
          username
          email
          permissions
        }
      }
    }
  `)

  if (loading) return <SimpleLoading />
  if (error || !data || !data.me || !data.myContest) return <BasicError />

  const canInvite = data.me.permissions.includes(InviteUsersPermission)
  const members = data.myContest.members
  return <MemberListView users={members} canInvite={canInvite} />
}
