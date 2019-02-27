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
import { push } from 'connected-react-router'
import React, { ComponentType, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { compose } from 'redux'

import { AppState, AppThunkDispatch } from '../../../stores'
import { User } from '../../../stores/Auth'
import { useMe } from '../helpers'
import { signOutAction } from './actions'
import { selectBreadcrumb } from './selectors'

export type TopNavigationBarBreadcrumb = IBreadcrumbProps

export interface TopNavigationBarProps {
  user: User
  breadcrumbs: TopNavigationBarBreadcrumb[]
  dispatch: AppThunkDispatch
}

export const TopNavigationBar: FunctionComponent<TopNavigationBarProps> = ({
  user,
  breadcrumbs,
  dispatch,
}) => {
  useMe(dispatch)
  const breadcrumbWithRouter = breadcrumbs.map(breadcrumbItem => ({
    ...breadcrumbItem,
    onClick: () => {
      if (breadcrumbItem.href) dispatch(push(breadcrumbItem.href))
    },
    href: undefined,
  }))
  const handleSignOut = () => dispatch(signOutAction())
  const handleMyAccount = () => dispatch(push('/account'))
  const handleSetting = () => dispatch(push('/setting'))
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

const mapStateToProps = (state: AppState) => ({
  breadcrumbs: selectBreadcrumb(state),
  user: state.auth.me,
})

export default compose<ComponentType>(connect(mapStateToProps))(
  TopNavigationBar
)
