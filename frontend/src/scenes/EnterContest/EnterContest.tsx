import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { publicOnly } from '../../helpers/auth'
import { Contest } from '../../services/contest/Contest'
import { AppThunkDispatch } from '../../stores'
import { setTitle } from '../../stores/Title'
import { enterContest, enterUser } from './actions'
import EnterContestForm from './EnterContestForm'
import { EnterContestView } from './EnterContestView'
import EnterPasswordForm from './EnterPasswordForm'
import EnterUserForm from './EnterUserForm'
import SignUpForm from './SignUpForm'

export interface EnterContestProps {
  dispatch: AppThunkDispatch
}

export enum Page {
  EnterContest = 'ENTER_CONTEST',
  EnterUsernameOrEmail = 'ENTER_USERNAME_OR_EMAIL',
  EnterPassword = 'ENTER_PASSWORD',
  SignUp = 'SignUp',
}

export interface EnterContestState {
  email?: string
  contest?: Contest
  page: Page
}

class SignIn extends React.Component<EnterContestProps, EnterContestState> {
  constructor(props: EnterContestProps) {
    super(props)
    this.state = {
      email: '',
      page: Page.EnterContest,
    }
  }
  componentDidMount() {
    this.props.dispatch(setTitle('UGrade | Enter Contest'))
  }
  handleEnterContestSubmit = async (contestId: string) => {
    const contest = await this.props.dispatch(enterContest(contestId))
    this.setState({ contest, page: Page.EnterUsernameOrEmail })
  }
  handleEnterUserSubmit = async (email: string) => {
    const contest = this.state.contest as Contest
    if (await this.props.dispatch(enterUser(contest.id, email))) {
      this.setState({ email, page: Page.EnterPassword })
    } else {
      this.setState({ email, page: Page.SignUp })
    }
  }
  handleUserSignUp = async (
    username: string,
    name: string,
    password: string
  ) => {
    return 'null'
  }
  handleEnterPasswordSubmit = async (password: string) => {
    return null
  }
  render() {
    let children = <React.Fragment />
    switch (this.state.page) {
      case Page.EnterContest:
        children = <EnterContestForm onSubmit={this.handleEnterContestSubmit} />
        break
      case Page.EnterUsernameOrEmail:
        children = (
          <EnterUserForm
            onSubmit={this.handleEnterUserSubmit}
            contestInfo={this.state.contest as Contest}
          />
        )
        break
      case Page.EnterPassword:
        children = (
          <EnterPasswordForm
            onSubmit={this.handleEnterPasswordSubmit}
            contestInfo={this.state.contest as Contest}
          />
        )
        break
      case Page.SignUp:
        children = (
          <SignUpForm
            onSubmit={this.handleUserSignUp}
            contestInfo={this.state.contest as Contest}
          />
        )
        break
    }
    return <EnterContestView>{children}</EnterContestView>
  }
}

export default compose<ComponentType>(
  publicOnly(),
  connect()
)(SignIn)
