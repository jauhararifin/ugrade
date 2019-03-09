import { Classes, Tooltip } from '@blueprintjs/core'
import React, { FunctionComponent, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useUsers } from '../useUsers'

export interface UserLinkProps {
  username: string
}

export const UserLink: FunctionComponent<UserLinkProps> = ({ username }) => {
  const arr = useMemo(() => [username], [username])
  const users = useUsers(arr)
  const name = users.length > 0 ? users[0].name : undefined
  const id = users.length > 0 ? users[0].id : undefined
  return (
    <Link to={id ? `/contest/members/${id}` : '#'}>
      <Tooltip className={Classes.TOOLTIP_INDICATOR} content={username}>
        {name ? name : username}
      </Tooltip>
    </Link>
  )
}
