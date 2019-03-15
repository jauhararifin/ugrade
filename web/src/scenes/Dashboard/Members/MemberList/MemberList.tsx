import React, { FunctionComponent } from 'react'
import { useAllUsers, usePermissions } from 'ugrade/auth'
import { UserPermission } from 'ugrade/auth/store'
import { SimpleLoading } from '../../components/SimpleLoading'
import { MemberListView } from './MemberListView'

export const MemberList: FunctionComponent = () => {
  const users = useAllUsers()
  const canInvite = usePermissions([UserPermission.UsersInvite])
  if (users) return <MemberListView users={users} canInvite={canInvite} />
  return <SimpleLoading />
}
