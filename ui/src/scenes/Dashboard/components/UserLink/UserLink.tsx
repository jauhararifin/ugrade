import { Classes, Intent, Tag, Tooltip } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

export interface UserLinkProps {
  user: {
    id: string
    name: string
    username: string
  }
}

export const UserLink: FunctionComponent<UserLinkProps> = ({ user: { id, name, username } }) => {
  if (!username || username === '') {
    return <Tag intent={Intent.DANGER}>Haven't Signed Up Yet</Tag>
  }
  return (
    <Link to={id ? `/contest/members/${id}` : '#'}>
      <Tooltip className={Classes.TOOLTIP_INDICATOR} content={username}>
        {name ? name : username}
      </Tooltip>
    </Link>
  )
}
