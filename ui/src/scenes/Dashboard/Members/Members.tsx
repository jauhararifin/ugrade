import { useRouting } from '@/routing'
import React, { FunctionComponent } from 'react'
import { Route, Switch } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useBreadcrumb } from '../TopNavigationBar/Breadcrumbs/Breadcrumbs'
import { InviteMembersForm } from './InviteMembersForm/InviteMembersForm'
import { MemberDetail } from './MemberDetail/MemberDetail'
import { MemberList } from './MemberList/MemberList'

export const Members: FunctionComponent = () => {
  const routingStore = useRouting()
  useBreadcrumb(`/contest/members`, 'Members')
  return (
    <TransitionGroup className='eat-them-all'>
      <CSSTransition timeout={300} classNames='fade' key={routingStore.location.pathname}>
        <Switch>
          <Route path='/contest/members' exact={true} component={MemberList} />
          <Route path='/contest/members/invite' exact={true} component={InviteMembersForm} />
          <Route path='/contest/members/:userId' component={MemberDetail} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  )
}
