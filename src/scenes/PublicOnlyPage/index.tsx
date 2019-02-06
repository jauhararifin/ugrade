import React, { ReactNode } from 'react'
import { AppState } from "../../reducers"
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

export interface PublicOnlyPageProps {
    children: ReactNode
    signedIn: boolean
    redirect: string
}

class PublicOnlyPage extends React.Component<PublicOnlyPageProps> {
    static defaultProps = {
        redirect: '/contest'
    }
    render() {
        const { signedIn, children, redirect } = this.props
        if (signedIn)
            return <Redirect to={redirect} />
        return <React.Fragment>{children}</React.Fragment>
    }
}

const mapStateToProps = (state: AppState) => ({
    signedIn: state.auth.isSignedIn,
})

export default connect(mapStateToProps)(PublicOnlyPage)