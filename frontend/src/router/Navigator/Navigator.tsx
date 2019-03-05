import React, { FunctionComponent } from 'react'
import { usePush } from '../usePush'

export interface NavigatorProps {
  to: string
}

export const Navigator: FunctionComponent<NavigatorProps> = ({
  to,
  children,
}) => {
  const push = usePush()
  const handleClick = () => push(to)
  return <div onClick={handleClick} children={children} />
}
