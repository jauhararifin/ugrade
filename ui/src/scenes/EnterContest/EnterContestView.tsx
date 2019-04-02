import logo from '@/assets/images/logo.svg'
import { BottomLink } from '@/components/BottomLink/BottomLink'
import { Location } from 'history'
import React, { FunctionComponent } from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { EnterContestForm } from './EnterContestForm/EnterContestForm'
import { EnterEmailForm } from './EnterEmailForm/EnterEmailForm'
import { EnterPasswordForm } from './EnterPasswordForm/EnterPasswordForm'
import { ResetPasswordForm } from './ResetPasswordForm/ResetPasswordForm'
import { SignUpForm } from './SignUpForm/SignUpForm'

import './styles.css'

export interface EnterContestViewProps {
  location: Location
}

export const EnterContestView: FunctionComponent<EnterContestViewProps> = ({ location }) => (
  <div className='plain-page'>
    <div className='enter-contest'>
      <Link to='/'>
        <img src={logo} width={100} alt='logo' />
      </Link>
      <h1>Welcome To UGrade</h1>
      <div className='content'>
        <TransitionGroup className='enter-contest-children'>
          <CSSTransition timeout={300} classNames='overlay' key={location.pathname}>
            <Switch location={location}>
              <Route path='/enter-contest/' exact={true} component={EnterContestForm} />
              <Route path='/enter-contest/:contestId/users/' exact={true} component={EnterEmailForm} />
              <Route
                path='/enter-contest/:contestId/users/:userId/password/'
                exact={true}
                component={EnterPasswordForm}
              />
              <Route
                path='/enter-contest/:contestId/users/:userId/reset-password/'
                exact={true}
                component={ResetPasswordForm}
              />
              <Route path='/enter-contest/:contestId/users/:userId/signup/' exact={true} component={SignUpForm} />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
    <BottomLink>
      <Link to='/create-contest'>Create Contest</Link>
    </BottomLink>
  </div>
)
