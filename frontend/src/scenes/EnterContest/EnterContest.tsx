import React, { ComponentType, ReactNode } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { FormikActions } from 'formik'
import { publicOnly } from '../../helpers/auth'
import ActionToaster from '../../middlewares/ErrorToaster/ActionToaster'
import { AuthError } from '../../services/auth'
import { Contest } from '../../services/contest/Contest'
import { ContestError } from '../../services/contest/errors'
import { AppThunkDispatch } from '../../stores'
import { setSignedIn } from '../../stores/Auth'
import { setTitle } from '../../stores/Title'
import EnterContestForm from './EnterContestForm'
import { EnterContestFormValue } from './EnterContestForm/EnterContestForm'
import { EnterContestView } from './EnterContestView'
import EnterEmailForm from './EnterEmailForm'
import { EnterEmailFormValue } from './EnterEmailForm/EnterEmailForm'
import EnterPasswordForm from './EnterPasswordForm'
import { EnterPasswordFormValue } from './EnterPasswordForm/EnterPasswordForm'
import SignUpForm from './SignUpForm'
import { SignUpFormValue } from './SignUpForm/SignUpForm'

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
      page: Page.EnterContest,
    }
  }

  componentDidMount() {
    this.props.dispatch(setTitle('UGrade | Enter Contest'))
  }

  handleEnterContestSubmit = (
    values: EnterContestFormValue,
    { setSubmitting }: FormikActions<EnterContestFormValue>
  ) => {
    this.props.dispatch(async (_dispatch, _getState, { contestService }) => {
      try {
        const contest = await contestService.getContestByShortId(
          values.contestId
        )
        this.setState({ contest, page: Page.EnterEmail })
      } catch (error) {
        if (error instanceof ContestError) ActionToaster.showErrorToast(error)
        else throw error
      } finally {
        setSubmitting(false)
      }
    })
  }

  handleEnterEmailSubmit = async (
    values: EnterEmailFormValue,
    { setSubmitting }: FormikActions<EnterEmailFormValue>
  ) => {
    this.props.dispatch(async (_dispatch, _getState, { authService }) => {
      try {
        const contest = this.state.contest as Contest
        const email = values.email
        if (await authService.isRegistered(contest.id, email)) {
          this.setState({ email, page: Page.EnterPassword })
        } else {
          this.setState({ email, page: Page.SignUp })
        }
      } catch (error) {
        if (error instanceof AuthError) ActionToaster.showErrorToast(error)
        else throw error
      } finally {
        setSubmitting(false)
      }
    })
  }

  handleUserSignUp = async (
    values: SignUpFormValue,
    { setSubmitting }: FormikActions<SignUpFormValue>
  ) => {
    this.props.dispatch(async (dispatch, _getState, { authService }) => {
      try {
        const contest = this.state.contest
        const email = this.state.email
        const { username, name, password, rememberMe } = values

        if (contest && email) {
          const token = await authService.signup(
            contest.id,
            username,
            email,
            name,
            password
          )
          dispatch(setSignedIn(token, rememberMe))
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
      } catch (error) {
        if (error instanceof AuthError) ActionToaster.showErrorToast(error)
        else throw error
      } finally {
        setSubmitting(false)
      }
    })
  }

  handleEnterPasswordSubmit = async (
    values: EnterPasswordFormValue,
    { setSubmitting }: FormikActions<EnterPasswordFormValue>
  ) => {
    this.props.dispatch(async (dispatch, _getState, { authService }) => {
      try {
        const contest = this.state.contest
        const email = this.state.email
        const { password, rememberMe } = values

        if (contest && email) {
          const token = await authService.signin(contest.id, email, password)
          dispatch(setSignedIn(token, rememberMe))
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
      } catch (error) {
        if (error instanceof AuthError) ActionToaster.showErrorToast(error)
        else throw error
      } finally {
        setSubmitting(false)
      }
    })
  }

  getForm(): ReactNode {
    switch (this.state.page) {
      case Page.EnterContest:
        return <EnterContestForm onSubmit={this.handleEnterContestSubmit} />
      case Page.EnterEmail:
        return (
          <EnterEmailForm
            onSubmit={this.handleEnterEmailSubmit}
            contestInfo={this.state.contest as Contest}
          />
        )
      case Page.EnterPassword:
        return (
          <EnterPasswordForm
            onSubmit={this.handleEnterPasswordSubmit}
            contestInfo={this.state.contest as Contest}
          />
        )
      case Page.SignUp:
        return (
          <SignUpForm
            onSubmit={this.handleUserSignUp}
            contestInfo={this.state.contest as Contest}
          />
        )
      default:
        return <React.Fragment />
    }
  }

  render() {
    return (
      <EnterContestView page={this.state.page}>
        {this.getForm()}
      </EnterContestView>
    )
  }
}

export default compose<ComponentType>(
  publicOnly(),
  connect()
)(SignIn)
