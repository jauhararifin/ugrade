import { Classes, Intent, Tag, Tooltip } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { User } from '../store'

export interface UserLinkProps {
  user: User
}

export const UserLink: FunctionComponent<UserLinkProps> = ({ user: { id, username } }) => {
  if (username === '') {
    return <Tag intent={Intent.DANGER}>Haven't Signed Up Yet</Tag>
  }
  // const arr = useMemo(() => [username], [username])
  // const users = useUsers(arr)
  // const name = users.length > 0 ? users[0].name : undefined
  // const id = users.length > 0 ? users[0].id : undefined
  return (
    <Link to={id ? `/contest/members/${id}` : '#'}>
      <Tooltip className={Classes.TOOLTIP_INDICATOR} content={username}>
        {name ? name : username}
      </Tooltip>
    </Link>
  )
}
