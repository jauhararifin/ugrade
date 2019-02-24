import React, { FunctionComponent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import './styles.css'

import logo from '../../assets/images/logo.svg'
import BottomLink from '../../components/BottomLink'
import { Page } from './EnterContest'

export interface EnterContestViewProps {
  children: ReactNode
  page: Page
}

export const EnterContestView: FunctionComponent<EnterContestViewProps> = ({
  children,
  page,
}) => (
  <div className='plain-page'>
    <div>
      <Link to='/'>
        <img src={logo} width={100} alt='logo' />
      </Link>
      <h1>Welcome To UGrade</h1>
      <TransitionGroup className='enter-contest-children'>
        <CSSTransition timeout={300} classNames='overlay' key={page}>
          {children}
        </CSSTransition>
      </TransitionGroup>
    </div>
    <BottomLink>
      <Link to='/create-contest'>Create Contest</Link>
      <Link to='/setting'>Setting</Link>
    </BottomLink>
  </div>
)
