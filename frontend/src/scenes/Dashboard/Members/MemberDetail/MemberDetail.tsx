import React, { FunctionComponent } from 'react'
import { RouteComponentProps } from 'react-router'
import { usePermissions, useUserWithId } from 'ugrade/auth'
import { UserPermission } from 'ugrade/auth/store'
import { useUserProfileWithId } from 'ugrade/userprofile'
import { MemberDetailLoadingView } from './MemberDetailLoadingView'
import { MemberDetailView } from './MemberDetailView'

export type MemberDetailProps = RouteComponentProps<{ userId: string }>

export const MemberDetail: FunctionComponent<MemberDetailProps> = ({
  match,
}) => {
  const profile = useUserProfileWithId(match.params.userId)
  const user = useUserWithId(match.params.userId)
  const canUpdatePermission = usePermissions([
    UserPermission.UsersPermissionsUpdate,
  ])
  if (!profile || !user) return <MemberDetailLoadingView />
  return (
    <MemberDetailView
      user={user}
      profile={profile}
      canUpdatePermission={canUpdatePermission}
    />
  )
}
