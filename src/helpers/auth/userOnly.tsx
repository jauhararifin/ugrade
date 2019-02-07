import React, { ComponentType, SFC } from 'react'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'

import { AppState } from '../../stores'

export const userOnly = (redirect: string = "/signin") =>
    <P extends object>(Component: ComponentType<P>) => {
        interface props {
            signedIn: boolean
        }
        const result: SFC<P & props> = (props) => {
            const { signedIn } = props
            if (!signedIn)
                return <Redirect to={redirect} />
            return <Component {...props} />
        }
        const mapStateToProps = (state: AppState): props => ({
            signedIn: state.auth.isSignedIn,
        })
        return connect(mapStateToProps)(result as any)
    }
