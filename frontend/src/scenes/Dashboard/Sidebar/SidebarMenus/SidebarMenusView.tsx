import { Alignment, Button, IconName, Intent, Tag } from '@blueprintjs/core'
import classnames from 'classnames'
import React, { FunctionComponent } from 'react'

export interface IMenu {
  onClick: () => any
  icon: IconName
  active: boolean
  visible: boolean
  title: string
  indicator?: number
}

export interface SidebarMenuViewProps {
  loading: boolean
  menus: IMenu[]
}

export const SidebarMenuView: FunctionComponent<SidebarMenuViewProps> = ({
  loading,
  menus,
}) => {
  const renderLoading = () =>
    [0, 1, 2].map(i => <Button key={i} fill={true} text='Fake' />)

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
        disabled={loading}
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

  return (
    <div className={classnames(['contest-menu', { 'bp3-skeleton': loading }])}>
      {loading ? renderLoading() : menus.map(renderMenu)}
    </div>
  )
}
