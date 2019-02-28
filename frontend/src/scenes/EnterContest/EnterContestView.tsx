import { Location } from 'history'
import React, { FunctionComponent } from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import logo from 'ugrade/assets/images/logo.svg'
import BottomLink from 'ugrade/components/BottomLink'
import { EnterContestForm } from './EnterContestForm'
import { EnterEmailForm } from './EnterEmailForm'
import EnterPasswordForm from './EnterPasswordForm'
import ResetPasswordForm from './ResetPasswordForm/ResetPasswordForm'
import SignUpForm from './SignUpForm'

import './styles.css'

export interface EnterContestViewProps {
  location: Location
}

export const EnterContestView: FunctionComponent<EnterContestViewProps> = ({
  location,
}) => (
  <div className='plain-page'>
    <div className='enter-contest'>
      <Link to='/'>
        <img src={logo} width={100} alt='logo' />
      </Link>
      <h1>Welcome To UGrade</h1>
      <TransitionGroup className='enter-contest-children'>
        <CSSTransition
          timeout={300}
          classNames='overlay'
          key={location.pathname}
        >
          <Switch location={location}>
            <Route
              path='/enter-contest/'
              exact={true}
              component={EnterContestForm}
            />
            <Route
              path='/enter-contest/enter-email'
              component={EnterEmailForm}
            />
            <Route
              path='/enter-contest/enter-password'
              component={EnterPasswordForm}
            />
            <Route
              path='/enter-contest/reset-password'
              component={ResetPasswordForm}
            />
            <Route path='/enter-contest/signup' component={SignUpForm} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </div>
    <BottomLink>
      <Link to='/create-contest'>Create Contest</Link>
      <Link to='/setting'>Setting</Link>
    </BottomLink>
  </div>
)
