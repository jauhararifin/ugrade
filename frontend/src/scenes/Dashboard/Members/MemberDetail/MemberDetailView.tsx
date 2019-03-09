import { H1, H4, HTMLTable, Intent, Tag } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import {
  genderToString,
  shirtSizeToString,
} from 'ugrade/scenes/MyAccount/MyAccountProfileForm'
import { UserProfile } from 'ugrade/userprofile/store'

import { User } from 'ugrade/auth/store'
import './styles.css'

export interface MemberDetailViewProps {
  user: User
  profile: UserProfile
}

export const MemberDetailView: FunctionComponent<MemberDetailViewProps> = ({
  profile,
  user,
}) => (
  <div className='member-detail'>
    <div className='header'>
      <H1>Member Detail</H1>
    </div>
    <div className='content'>
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
                <Tag intent={Intent.DANGER}>Not Yet Registered</Tag>
              ) : (
                <Tag intent={Intent.SUCCESS}>Registered</Tag>
              )}
            </td>
          </tr>
        </tbody>
      </HTMLTable>
      <H4>Profiles</H4>
      <HTMLTable className='profile-table'>
        <tbody>
          <tr>
            <td className='col-key'>Address</td>
            <td>
              {!profile.address || profile.address.length === 0
                ? '-'
                : profile.address}
            </td>
          </tr>
          <tr>
            <td className='col-key'>Gender</td>
            <td>{profile.gender ? genderToString(profile.gender) : '-'}</td>
          </tr>
          <tr>
            <td className='col-key'>Shirt Size</td>
            <td>
              {profile.shirtSize ? shirtSizeToString(profile.shirtSize) : '-'}
            </td>
          </tr>
        </tbody>
      </HTMLTable>
    </div>
  </div>
)
