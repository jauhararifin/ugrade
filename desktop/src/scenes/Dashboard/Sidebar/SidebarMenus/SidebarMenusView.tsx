import { Alignment, Button, IconName, Intent, Tag } from '@blueprintjs/core'
import React, { Fragment, FunctionComponent } from 'react'

export interface IMenu {
  onClick: () => any
  icon: IconName
  active: boolean
  visible: boolean
  title: string
  indicator?: number
}

export interface SidebarMenuViewProps {
  menus: IMenu[]
}

export const SidebarMenuView: FunctionComponent<SidebarMenuViewProps> = ({
  menus,
}) => {
  const renderMenu = (menu: IMenu, key?: any) =>
    menu.visible && (
      <Button
        key={key}
        icon={menu.icon}
        onClick={menu.onClick}
        intent={menu.active ? Intent.PRIMARY : Intent.NONE}
        fill={true}
        minimal={true}
        alignText={Alignment.LEFT}
      >
        <div className='menu-item'>
          <div className='menu-title'>{menu.title}</div>
          {menu.indicator !== undefined && menu.indicator > 0 && (
            <div className='menu-tag'>
              <Tag round={true} intent={Intent.SUCCESS}>
                {menu.indicator}
              </Tag>
            </div>
          )}
        </div>
      </Button>
    )

  return <Fragment>{menus.map(renderMenu)}</Fragment>
}
