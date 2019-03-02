import {
  Alignment,
  Breadcrumbs,
  Button,
  Classes,
  IBreadcrumbProps,
  Menu,
  MenuItem,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Popover,
  Position,
} from '@blueprintjs/core'
import classNames from 'classnames'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { useMappedState } from 'redux-react-hook'
import { useContestOnly, useMe, useSignOut } from 'ugrade/auth'
import { TopToaster } from 'ugrade/common/ActionToaster'
import { usePush } from 'ugrade/router'
import { selectBreadcrumb } from './selectors'

export type TopNavigationBarBreadcrumb = IBreadcrumbProps

export const TopNavigationBar: FunctionComponent = () => {
  useContestOnly()
  const user = useMe()
  const breadcrumbs = useMappedState(selectBreadcrumb)
  const push = usePush()
  const signOut = useSignOut()

  const breadcrumbWithRouter = breadcrumbs.map(breadcrumbItem => ({
    ...breadcrumbItem,
    onClick: () => {
      if (breadcrumbItem.href) push(breadcrumbItem.href)
    },
    href: undefined,
  }))

  const handleSignOut = async () => {
    await signOut()
    TopToaster.showSuccessToast('Signed Out')
  }
  const handleMyAccount = () => push('/account')
  const handleSetting = () => push('/setting')

  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <Link to='/'>
          <NavbarHeading>UGrade</NavbarHeading>
        </Link>
        <NavbarDivider />
        <Breadcrumbs items={breadcrumbWithRouter} />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Popover
          disabled={!user}
          content={
            <Menu>
              <MenuItem onClick={handleMyAccount} text='My Account' />
              <MenuItem onClick={handleSetting} text='Setting' />
              <MenuItem onClick={handleSignOut} text='Sign Out' />
            </Menu>
          }
          position={Position.BOTTOM}
        >
          <Button
            icon='caret-down'
            large={true}
            rightIcon='user'
            className={classNames(Classes.MINIMAL, {
              [Classes.SKELETON]: !user,
            })}
            text={(user && user.name) || 'Test'}
          />
        </Popover>
      </NavbarGroup>
    </Navbar>
  )
}
