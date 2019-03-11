import React, { FunctionComponent } from 'react'
import { useAllUsers, usePermissions } from 'ugrade/auth'
import { UserPermission } from 'ugrade/auth/store'
import { SimpleLoading } from '../components/SimpleLoading'
import { MembersView } from './MembersView'

export const Members: FunctionComponent = () => {
  const users = useAllUsers()
  const canInvite = usePermissions([UserPermission.UsersInvite])
  if (users) return <MembersView users={users} canInvite={canInvite} />
  return <SimpleLoading />
}