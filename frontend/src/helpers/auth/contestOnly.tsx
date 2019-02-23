import React, { ComponentType, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import { AppState } from '../../stores'

export const contestOnly = (redirect: string = '/enter-contest') => <
  P extends object
>(
  Component: ComponentType<P>
) => {
  interface Props {
    contestId: string
  }
  const result: FunctionComponent<P & Props> = props => {
    const { contestId } = props
    if (!contestId || contestId.length === 0) return <Redirect to={redirect} />
    return <Component {...props} />
  }
  const mapStateToProps = (state: AppState): Props => ({
    contestId: state.contest.id || '',
  })
  return connect(mapStateToProps)(result as any)
}
