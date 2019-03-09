import { Button, H1, HTMLTable, Intent } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import { UserLink } from 'ugrade/auth/components'
import { User } from 'ugrade/auth/store'

import { Link } from 'react-router-dom'
import './styles.css'

export interface MembersViewProps {
  users: User[]
  canInvite: boolean
}

export const MembersView: FunctionComponent<MembersViewProps> = ({
  users,
  canInvite,
}) => (
  <div className='contest-members'>
    <H1 className='header'>Members</H1>
    <div className='content'>
      <div className='actions'>
        {canInvite && (
          <Button intent={Intent.SUCCESS} icon='plus'>
            Invite
          </Button>
        )}
      </div>
      <HTMLTable striped={true} className='users-table'>
        <tbody>
          {users.map(user => (
            <tr>
              <td className='col-user'>
                <UserLink username={user.username} />
              </td>
              <td className='col-email'>
                <Link to={`/contest/members/${user.id}`}>{user.email}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </HTMLTable>
    </div>
  </div>
)
