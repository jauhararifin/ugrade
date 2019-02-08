import React from 'react'
import {
    Navbar,
    Alignment,
    NavbarHeading,
    NavbarDivider,
    Breadcrumbs,
    NavbarGroup,
    Button,
    Classes,
    IBreadcrumbProps,
    Popover,
    Position,
    Menu,
    MenuItem,
} from "@blueprintjs/core"
import classNames from "classnames"
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { selectBreadcrumb } from './selectors'
import { AppState, AppThunkDispatch } from '../../stores'
import { User } from '../../stores/Auth'
import { getMeAction, setMeSignOut } from './actions'

export type TopNavigationBarBreadcrumb = IBreadcrumbProps

export interface TopNavigationBarProps {
    user: User
    breadcrumbs: TopNavigationBarBreadcrumb[]
    dispatch: AppThunkDispatch
}

export class TopNavigationBar extends React.Component<TopNavigationBarProps> {
    constructor(props: TopNavigationBarProps) {
        super(props)
        props.dispatch(getMeAction())
    }

    render() {
        const { user, breadcrumbs, dispatch } = this.props
        return (
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading>UGrade</NavbarHeading>
                    <NavbarDivider />
                    <Breadcrumbs items={breadcrumbs} />
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <Popover
                        disabled={!user}
                        content={<Menu>
                        <Link to="/account"><MenuItem text="My Account" /></Link>
                        <Link to="/setting"><MenuItem text="Setting" /></Link>
                        <MenuItem onClick={() => dispatch(setMeSignOut())} text="Sign Out" />
                    </Menu>} position={Position.BOTTOM}>
                        <Button
                            icon="caret-down"
                            large
                            rightIcon="user"
                            className={classNames(Classes.MINIMAL, { [Classes.SKELETON]: !user })}
                            text={(user && user.name) || 'Test'}
                        />
                    </Popover>
                </NavbarGroup>
            </Navbar>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    breadcrumbs: selectBreadcrumb(state),
    user: state.auth.me
})

export default connect(mapStateToProps)(TopNavigationBar as any)