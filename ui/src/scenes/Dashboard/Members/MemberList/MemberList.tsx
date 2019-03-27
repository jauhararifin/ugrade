import { toJS } from 'mobx'
import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent, useEffect } from 'react'
import { useAuth, useContest } from '../../../../app'
import { Permission } from '../../../../auth'
import { SimpleLoading } from '../../components/SimpleLoading'
import { MemberListView } from './MemberListView'

export const MemberList: FunctionComponent = () => {
  const contestStore = useContest()
  const authStore = useAuth()
  return useObserver(() => {
    const users = contestStore.members
    console.log(toJS(users))
    const canInvite = authStore.can(Permission.InviteUsers)
    if (users) return <MemberListView users={users} canInvite={canInvite} />
    return <SimpleLoading />
  })
}
