import { Button, HTMLTable, Intent } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { UserLink } from 'ugrade/auth/components'
import { User } from 'ugrade/auth/store'
import { Navigator } from 'ugrade/router/Navigator'
import { Content } from '../components/Content'
import { Header } from '../components/Header'

import './styles.css'

export interface MembersViewProps {
  users: User[]
  canInvite: boolean
}

export const MembersView: FunctionComponent<MembersViewProps> = ({
  users,
  canInvite,
}) => (
  <Content className='contest-members'>
    <Header>Members</Header>
    <div className='content'>
      <div className='actions'>
        {canInvite && (
          <Navigator to='/contest/members/invite'>
            <Button intent={Intent.SUCCESS} icon='new-person'>
              Invite
            </Button>
          </Navigator>
        )}
      </div>
      <HTMLTable striped={true} className='users-table'>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
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
  </Content>
)
