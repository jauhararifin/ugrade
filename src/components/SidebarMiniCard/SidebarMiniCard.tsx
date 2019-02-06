import React, { ReactNode } from 'react'

import './styles.css'

export interface SidebarMiniCardProps {
    children: ReactNode
}

export const SidebarMiniCard: React.SFC<SidebarMiniCardProps> = ({ children }) => (
    <div className="sidebar-mini-card">
        {children}
    </div>
)

export default SidebarMiniCard