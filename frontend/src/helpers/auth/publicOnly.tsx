import React, { ComponentType, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import { AppState } from '../../stores'

export const publicOnly = (redirect: string = '/contest') => <P extends object>(
  Component: ComponentType<P>
) => {
  interface Props {
    signedIn: boolean
    location: string
  }
  const result: FunctionComponent<P & Props> = props => {
    const { signedIn, location } = props
    if (signedIn && location !== redirect) return <Redirect to={redirect} />
    return <Component {...props} />
  }
  const mapStateToProps = (state: AppState): Props => ({
    signedIn: state.auth.isSignedIn,
    location: state.router.location.pathname,
  })
  return connect(mapStateToProps)(result as any)
}
