import React, { FunctionComponent } from 'react'
import { Route, Switch } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useLocation } from 'ugrade/router'
import { CreateProblem } from './CreateProblem'
import { ProblemDetail } from './ProblemDetail'
import { ProblemList } from './ProblemList'
import { UpdateProblem } from './UpdateProblem'

export const Problems: FunctionComponent = () => {
  const location = useLocation()
  return (
    <TransitionGroup className='eat-them-all'>
      <CSSTransition timeout={300} classNames='fade' key={location.pathname}>
        <Switch>
          <Route
            path='/contest/problems'
            exact={true}
            component={ProblemList}
          />
          <Route
            path='/contest/problems/create'
            exact={true}
            component={CreateProblem}
          />
          <Route
            path='/contest/problems/:problemId/edit'
            component={UpdateProblem}
          />
          <Route
            path='/contest/problems/:problemId'
            component={ProblemDetail}
          />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  )
}
