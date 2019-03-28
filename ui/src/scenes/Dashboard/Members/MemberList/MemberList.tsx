import { useAuth, useContest } from '@/app'
import { Permission } from '@/auth'
import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import { SimpleLoading } from '../../components/SimpleLoading'
import { MemberListView } from './MemberListView'

export const MemberList: FunctionComponent = () => {
  const contestStore = useContest()
  const authStore = useAuth()
  return useObserver(() => {
    const users = contestStore.members
    const canInvite = authStore.can(Permission.InviteUsers)
    if (users) return <MemberListView users={users} canInvite={canInvite} />
    return <SimpleLoading />
  })
}
