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
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { AppState, AppThunkDispatch } from '../../stores'
import { User } from '../../stores/Auth'
import { getMeAction, setMeSignOut } from './actions'
import { selectBreadcrumb } from './selectors'

export type TopNavigationBarBreadcrumb = IBreadcrumbProps

export interface TopNavigationBarProps {
  user: User
  breadcrumbs: TopNavigationBarBreadcrumb[]
  dispatch: AppThunkDispatch
}

export class TopNavigationBar extends React.Component<TopNavigationBarProps> {
  constructor(props: TopNavigationBarProps) {
    super(props)
    props.dispatch(getMeAction()).catch(null)
  }

  render() {
    const { user, breadcrumbs, dispatch } = this.props
    const breadcrumbWithRouter = breadcrumbs.map(breadcrumbItem => ({
      ...breadcrumbItem,
      onClick: () => {
        if (breadcrumbItem.href) dispatch(push(breadcrumbItem.href))
      },
      href: undefined,
    }))
    const handleSignOut = () => this.props.dispatch(setMeSignOut())
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
                <Link to='/account'>
                  <MenuItem text='My Account' />
                </Link>
                <Link to='/setting'>
                  <MenuItem text='Setting' />
                </Link>
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
}

const mapStateToProps = (state: AppState) => ({
  breadcrumbs: selectBreadcrumb(state),
  user: state.auth.me,
})

export default connect(mapStateToProps)(TopNavigationBar as any)
