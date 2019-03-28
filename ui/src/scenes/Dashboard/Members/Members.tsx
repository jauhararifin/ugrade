import { useRouting } from '@/app'
import React, { FunctionComponent } from 'react'
import { Route, Switch } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { InviteMembersForm } from './InviteMembersForm'
import { MemberDetail } from './MemberDetail'
import { MemberList } from './MemberList'

export const Members: FunctionComponent = () => {
  const routingStore = useRouting()
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
