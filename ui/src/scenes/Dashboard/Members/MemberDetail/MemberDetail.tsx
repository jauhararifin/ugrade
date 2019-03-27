import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import { RouteComponentProps } from 'react-router'
import { useAuth, useContest } from '../../../../app'
import { Permission } from '../../../../auth'
import { SimpleLoading } from '../../components/SimpleLoading'
import { MemberDetailView } from './MemberDetailView'

export type MemberDetailProps = RouteComponentProps<{ userId: string }>

export const MemberDetail: FunctionComponent<MemberDetailProps> = ({ match }) => {
  const authStore = useAuth()
  const contestStore = useContest()
  return useObserver(() => {
    const canUpdatePermission = authStore.can(Permission.UpdateUsersPermissions)
    const memberList = contestStore.members
    const user = memberList && memberList.filter(v => v.id === match.params.userId).pop()

    if (!user) return <SimpleLoading />
    return <MemberDetailView user={user} canUpdatePermission={canUpdatePermission} />
  })
}
