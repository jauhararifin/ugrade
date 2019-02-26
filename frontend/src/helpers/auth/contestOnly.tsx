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
    signedIn: boolean
  }
  const result: FunctionComponent<P & Props> = props => {
    const { signedIn } = props
    if (!signedIn) return <Redirect to={redirect} />
    return <Component {...props} />
  }
  const mapStateToProps = (state: AppState): Props => ({
    signedIn: state.auth.isSignedIn,
  })
  return connect(mapStateToProps)(result as any)
}
