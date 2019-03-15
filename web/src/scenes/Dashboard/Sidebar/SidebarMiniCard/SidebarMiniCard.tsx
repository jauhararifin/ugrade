import classnames from 'classnames'
import React, { FunctionComponent, HTMLAttributes, ReactNode } from 'react'

import './styles.css'

export interface SidebarMiniCardProps extends HTMLAttributes<Element> {
  children: ReactNode
}

export const SidebarMiniCard: FunctionComponent<
  SidebarMiniCardProps
> = props => (
  <div
    {...props}
    className={classnames('sidebar-mini-card', props.className)}
  />
)
