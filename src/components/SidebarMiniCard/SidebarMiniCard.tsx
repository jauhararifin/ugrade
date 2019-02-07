import React, { ReactNode, HTMLAttributes } from 'react'
import classnames from "classnames"

import './styles.css'

export interface SidebarMiniCardProps extends HTMLAttributes<Element> {
    children: ReactNode
}

export const SidebarMiniCard: React.SFC<SidebarMiniCardProps> = (props) => (
    <div {...props} className={classnames("sidebar-mini-card", props.className)} />
)

export default SidebarMiniCard