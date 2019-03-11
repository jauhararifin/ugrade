import React, { FunctionComponent } from 'react'
import { Route } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useLocation } from 'ugrade/router'
import { InviteMembersForm } from './InviteMembersForm'
import { MemberDetail } from './MemberDetail'
import { MemberList } from './MemberList'

export const Members: FunctionComponent = () => {
  const location = useLocation()
  return (
    <TransitionGroup className='eat-them-all'>
      <CSSTransition timeout={300} classNames='fade' key={location.pathname}>
        <Route path='/contest/members' exact={true} component={MemberList} />
        <Route
          path='/contest/members/invite'
          exact={true}
          component={InviteMembersForm}
        />
        <Route path='/contest/members/:userId' component={MemberDetail} />
      </CSSTransition>
    </TransitionGroup>
  )
}
