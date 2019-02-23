import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { publicOnly } from '../../helpers/auth'
import { Contest } from '../../services/contest/Contest'
import { AppThunkDispatch } from '../../stores'
import { setSignedIn } from '../../stores/Auth'
import { setTitle } from '../../stores/Title'
import { enterContest, enterUser, signIn, signUp } from './actions'
import EnterContestForm from './EnterContestForm'
import { EnterContestView } from './EnterContestView'
import EnterEmailForm from './EnterEmailForm'
import EnterPasswordForm from './EnterPasswordForm'
import SignUpForm from './SignUpForm'

export interface EnterContestProps {
  dispatch: AppThunkDispatch
}

export enum Page {
  EnterContest = 0,
  EnterEmail = 1,
  EnterPassword = 2,
  SignUp = 3,
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
    this.setState({ contest, page: Page.EnterEmail })
  }

  handleEnterEmailSubmit = async (email: string) => {
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
    password: string,
    rememberMe: boolean
  ) => {
    const contest = this.state.contest
    const email = this.state.email
    if (contest && email) {
      const token = await this.props.dispatch(
        signUp(contest.id, email, username, name, password)
      )
      this.props.dispatch(setSignedIn(token, rememberMe))
    } else if (!contest) {
      this.setState({
        email: undefined,
        page: Page.EnterContest,
      })
    } else if (!email) {
      this.setState({
        page: Page.EnterEmail,
      })
    }
  }

  handleEnterPasswordSubmit = async (password: string, rememberMe: boolean) => {
    const contest = this.state.contest
    const email = this.state.email
    if (contest && email) {
      const token = await this.props.dispatch(
        signIn(contest.id, email, password)
      )
      this.props.dispatch(setSignedIn(token, rememberMe))
    } else if (!contest) {
      this.setState({
        email: undefined,
        page: Page.EnterContest,
      })
    } else if (!email) {
      this.setState({
        page: Page.EnterEmail,
      })
    }
  }

  render() {
    let children = <React.Fragment />
    switch (this.state.page) {
      case Page.EnterContest:
        children = <EnterContestForm onSubmit={this.handleEnterContestSubmit} />
        break
      case Page.EnterEmail:
        children = (
          <EnterEmailForm
            onSubmit={this.handleEnterEmailSubmit}
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
    return (
      <EnterContestView page={this.state.page}>{children}</EnterContestView>
    )
  }
}

export default compose<ComponentType>(
  publicOnly(),
  connect()
)(SignIn)
