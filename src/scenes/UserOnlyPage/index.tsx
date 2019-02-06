import React, { ReactNode } from 'react'
import { AppState } from "../../stores"
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

export interface UserOnlyPageProps {
    children: ReactNode
    signedIn: boolean
    redirect: string
}

class UserOnlyPage extends React.Component<UserOnlyPageProps> {
    static defaultProps = {
        redirect: '/signin'
    }
    render() {
        const { signedIn, children, redirect } = this.props
        if (!signedIn)
            return <Redirect to={redirect} />
        return <React.Fragment>{children}</React.Fragment>
    }
}

const mapStateToProps = (state: AppState) => ({
    signedIn: state.auth.isSignedIn,
})

export default connect(mapStateToProps)(UserOnlyPage)