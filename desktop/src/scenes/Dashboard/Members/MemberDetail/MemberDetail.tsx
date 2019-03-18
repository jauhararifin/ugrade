import React, { FunctionComponent } from 'react'
import { RouteComponentProps } from 'react-router'
import { usePermissions, useUserWithId } from 'ugrade/auth'
import { UserPermission } from 'ugrade/auth/store'
import { useUserProfileWithId } from 'ugrade/userprofile'
import { SimpleLoading } from '../../components/SimpleLoading'
import { MemberDetailView } from './MemberDetailView'

export type MemberDetailProps = RouteComponentProps<{ userId: string }>

export const MemberDetail: FunctionComponent<MemberDetailProps> = ({
  match,
}) => {
  const canUpdatePermission = usePermissions([
    UserPermission.UsersPermissionsUpdate,
  ])
  const canReadProfile = usePermissions([UserPermission.ProfilesRead])
  const profile = useUserProfileWithId(
    canReadProfile ? match.params.userId : undefined
  )
  const user = useUserWithId(match.params.userId)

  if (!user || (canReadProfile && !profile)) return <SimpleLoading />
  return (
    <MemberDetailView
      user={user}
      profile={profile}
      canUpdatePermission={canUpdatePermission}
    />
  )
}
