import { push } from 'connected-react-router'
import React, { Component, ComponentType } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { compose } from 'redux'
import * as yup from 'yup'

import { Formik, FormikActions, FormikProps } from 'formik'
import { AppState, AppThunkDispatch } from '../../../stores'
import { Contest } from '../../../stores/Contest'
import { ContestDetailSceneRoute } from '../ContestDetailScene'
import { ContestSubmitFormValue } from './ContestSubmitForm'
import { Menu, SidebarView } from './SidebarView'

export interface SidebarSceneFromRedux {
  contest?: Contest
  dispatch: AppThunkDispatch
}

export interface SidebarSceneInitialProps {
  serverClock?: Date
}

export type SidebarSceneProps = RouteComponentProps<ContestDetailSceneRoute> &
  SidebarSceneFromRedux &
  SidebarSceneInitialProps

export interface SidebarSceneState {
  menu: Menu
}

export class SidebarScene extends Component<
  SidebarSceneProps,
  SidebarSceneState
> {
  submitSolutionInitialValue = {
    language: 0,
    problem: 0,
  }

  submitSolutionSchema = yup.object().shape({
    language: yup.number().required(),
    problem: yup.number().required(),
  })

  constructor(props: SidebarSceneProps) {
    super(props)
    this.state = { menu: this.getCurrentMenu() }
  }

  getCurrentMenu = () => {
    let menu = Menu.Overview
    const match = this.props.location.pathname.match(
      /contests\/[0-9]+\/([a-z]+)/
    )
    if (match && match[1]) {
      switch (match[1]) {
        case 'announcements':
          menu = Menu.Announcements
          break
        case 'problems':
          menu = Menu.Problems
          break
        case 'clarifications':
          menu = Menu.Clarifications
          break
        case 'submissions':
          menu = Menu.Submissions
          break
        case 'scoreboard':
          menu = Menu.Scoreboard
          break
      }
    }
    return menu
  }

  onMenuChoosed = (menu: Menu) => {
    const contestId = Number(this.props.match.params.contestId)

    this.setState({ menu })
    switch (menu) {
      case Menu.Overview:
        return this.props.dispatch(push(`/contests/${contestId}`))
      case Menu.Announcements:
        return this.props.dispatch(push(`/contests/${contestId}/announcements`))
      case Menu.Problems:
        return this.props.dispatch(push(`/contests/${contestId}/problems`))
      case Menu.Clarifications:
        return this.props.dispatch(
          push(`/contests/${contestId}/clarifications`)
        )
      case Menu.Submissions:
        return this.props.dispatch(push(`/contests/${contestId}/submissions`))
      case Menu.Scoreboard:
        return this.props.dispatch(push(`/contests/${contestId}/scoreboard`))
    }
  }

  handleSubmitSolution = (
    _values: ContestSubmitFormValue,
    { setSubmitting, resetForm }: FormikActions<ContestSubmitFormValue>
  ) => {
    setSubmitting(false)
    resetForm()
  }

  render() {
    const { contest, serverClock } = this.props
    const newAnnouncementCount =
      contest && contest.announcements
        ? contest.announcements.filter(x => !x.read).length
        : 0
    const menu = this.state.menu
    const rank = 21

    const getSidebarView = (props: FormikProps<ContestSubmitFormValue>) => (
      <SidebarView
        contest={contest}
        rank={rank}
        serverClock={serverClock}
        menu={menu}
        onChoose={this.onMenuChoosed}
        newAnnouncementCount={newAnnouncementCount}
        submitForm={props}
      />
    )

    return (
      <Formik
        initialValues={this.submitSolutionInitialValue}
        validationSchema={this.submitSolutionSchema}
        onSubmit={this.handleSubmitSolution}
        render={getSidebarView}
      />
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  contest: state.contest.currentContest,
})

export default compose<ComponentType<SidebarSceneInitialProps>>(
  connect(mapStateToProps),
  withRouter
)(SidebarScene)
