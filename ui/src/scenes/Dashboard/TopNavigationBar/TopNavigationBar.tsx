import { clearToken, useContestOnly } from '@/auth'
import { useRouting } from '@/routing'
import { showSuccessToast } from '@/toaster'
import {
  Alignment,
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
import gql from 'graphql-tag'
import React, { FunctionComponent } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from './Breadcrumbs/Breadcrumbs'

export type TopNavigationBarBreadcrumb = IBreadcrumbProps

export const TopNavigationBar: FunctionComponent = () => {
  useContestOnly()

  const routingStore = useRouting()
  const handleSignOut = async () => {
    clearToken()
    routingStore.push('/enter-contest')
    showSuccessToast('Signed Out')
  }

  const { data, loading, error } = useQuery(gql`
    query GetMe {
      me {
        name
      }
    }
  `)

  if (error) return null

  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <Link to='/contest'>
          <NavbarHeading>UGrade</NavbarHeading>
        </Link>
        <NavbarDivider />
        <Breadcrumbs />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Popover
          disabled={loading}
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
              [Classes.SKELETON]: loading,
            })}
            text={data && data.me && data.me.name}
          />
        </Popover>
      </NavbarGroup>
    </Navbar>
  )
}
