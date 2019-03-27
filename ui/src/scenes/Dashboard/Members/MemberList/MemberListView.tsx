import { Button, HTMLTable, Intent } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { User } from '../../../../auth'
import { ContentWithHeader } from '../../components/ContentWithHeader'
import { UserLink } from '../../components/UserLink'

import './styles.css'

export interface MemberListViewProps {
  users: User[]
  canInvite: boolean
}

export const MemberListView: FunctionComponent<MemberListViewProps> = ({ users, canInvite }) => (
  <ContentWithHeader header='Members' className='contest-member-list'>
    <div className='content'>
      <div className='actions'>
        {canInvite && (
          <Link to='/contest/members/invite'>
            <Button intent={Intent.SUCCESS} icon='new-person'>
              Invite
            </Button>
          </Link>
        )}
      </div>
      <HTMLTable striped={true} className='users-table'>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className='col-user'>
                <UserLink user={user} />
              </td>
              <td className='col-email'>
                <Link to={`/contest/members/${user.id}`}>{user.email}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </HTMLTable>
    </div>
  </ContentWithHeader>
)
