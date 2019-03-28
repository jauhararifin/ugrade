import { useAuth, useContest, useProblem, useRouting } from '@/app'
import { showSuccessToast, useContestOnly } from '@/common'
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
import { useObserver } from 'mobx-react-lite'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { getBreadcrumb } from './breadcrumb'

export type TopNavigationBarBreadcrumb = IBreadcrumbProps

export const TopNavigationBar: FunctionComponent = () => {
  useContestOnly()
  const authStore = useAuth()
  const contestStore = useContest()
  const problemStore = useProblem()
  const routingStore = useRouting()

  const handleSignOut = async () => {
    authStore.signOut()
    showSuccessToast('Signed Out')
  }

  return useObserver(() => {
    const breadcrumbs = getBreadcrumb(routingStore.location, contestStore.current, problemStore.problems)
    const breadcrumbWithRouter = breadcrumbs.map(breadcrumbItem => ({
      ...breadcrumbItem,
      onClick: () => {
        if (breadcrumbItem.href) routingStore.push(breadcrumbItem.href)
      },
      href: undefined,
    }))
    return (
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <Link to='/contest'>
            <NavbarHeading>UGrade</NavbarHeading>
          </Link>
          <NavbarDivider />
          <Breadcrumbs items={breadcrumbWithRouter} />
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <Popover
            disabled={!authStore.me}
            content={
              <Menu>
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
                [Classes.SKELETON]: !authStore.me,
              })}
              text={authStore.me && authStore.me.name}
            />
          </Popover>
        </NavbarGroup>
      </Navbar>
    )
  })
}
