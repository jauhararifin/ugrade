import { H4, HTMLTable, Intent, Tag } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import { User } from '../../../../auth'
import { ContentWithHeader } from '../../components/ContentWithHeader'
import { PermissionForm } from '../PermissionForm'

import './styles.css'

export interface MemberDetailViewProps {
  user: User
  canUpdatePermission: boolean
}

export const MemberDetailView: FunctionComponent<MemberDetailViewProps> = ({ user, canUpdatePermission }) => (
  <ContentWithHeader className='member-detail' header='Member Detail'>
    <div className='content'>
      <div className='content-account'>
        <H4>Account</H4>
        <HTMLTable className='account-table'>
          <tbody>
            <tr>
              <td className='col-key'>User ID</td>
              <td>{user.id}</td>
            </tr>
            <tr>
              <td className='col-key'>Username</td>
              <td>{user.username}</td>
            </tr>
            <tr>
              <td className='col-key'>Name</td>
              <td>{user.name}</td>
            </tr>
            <tr>
              <td className='col-key'>Email</td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td className='col-key'>Status</td>
              <td>
                {!user.username || user.username.length === 0 ? (
                  <Tag intent={Intent.DANGER}>Haven't Signed Up Yet</Tag>
                ) : (
                  <Tag intent={Intent.SUCCESS}>Registered</Tag>
                )}
              </td>
            </tr>
          </tbody>
        </HTMLTable>
      </div>

      {canUpdatePermission && (
        <div className='content-permission'>
          <H4>User's Permissions</H4>
          <PermissionForm user={user} />
        </div>
      )}
    </div>
  </ContentWithHeader>
)
