import {
  Button,
  Card,
  Elevation,
  H1,
  H3,
  H5,
  Intent,
  Tag,
} from '@blueprintjs/core'
import classnames from 'classnames'
import 'github-markdown-css'
import moment from 'moment'
import React, { Component } from 'react'

import './styles.css'

import { Clarification, Contest } from '../../../stores/Contest'
import CreateClarificationForm from './CreateClarificationForm'
import ClarificationDetail from './Detail'

export interface ClarificationsViewProps {
  contest?: Contest
  serverClock?: Date
}

export interface ClarificationsViewState {
  currentClarification?: Clarification
}

export class ClarificationsView extends Component<
  ClarificationsViewProps,
  ClarificationsViewState
> {
  constructor(props: ClarificationsViewProps) {
    super(props)
    this.state = { currentClarification: undefined }
  }

  render() {
    const { contest, serverClock } = this.props
    const loading = !contest || !contest.clarifications || !contest.problems
    const currentMoment = moment(serverClock || new Date())
    const createClarificationChooseHandler = (
      clarification: Clarification
    ) => () => this.setState({ currentClarification: clarification })
    const clarificationUnchooseHandler = () =>
      this.setState({ currentClarification: undefined })

    return (
      <div className='contest-clarifications'>
        {serverClock && (
          <ClarificationDetail
            clarification={this.state.currentClarification}
            handleClose={clarificationUnchooseHandler}
            serverClock={serverClock || new Date()}
          />
        )}
        <H1 className={classnames('header', { 'bp3-skeleton': loading })}>
          Clarifications
        </H1>
        <div>
          {loading && (
            <Card className='bp3-skeleton item'>
              {'lorem ipsum'.repeat(100)}
            </Card>
          )}

          {!loading &&
            contest &&
            contest.clarifications &&
            contest.clarifications.length === 0 && (
              <H3>No Clarifications Yet</H3>
            )}

          {!loading &&
            contest &&
            contest.clarifications &&
            contest.clarifications.map(clarification => {
              const notReadCount = clarification.entries.filter(
                entry => !entry.read
              ).length
              const content = clarification.entries[0]
              return (
                <Card
                  key={clarification.id}
                  className='item'
                  elevation={
                    notReadCount === 0 ? Elevation.ZERO : Elevation.TWO
                  }
                >
                  <div className='header'>
                    <H5 className='subject'>{clarification.subject}</H5>
                    <H3 className='title'>{clarification.title}</H3>
                    <div className='info'>
                      <div className='info-container'>
                        <p className='time'>
                          {moment(clarification.issuedTime).from(currentMoment)}
                        </p>
                        {notReadCount > 0 && (
                          <p className='unread'>
                            <Tag
                              className='unread'
                              icon={'notifications'}
                              large={true}
                              intent={Intent.DANGER}
                            >
                              {notReadCount}
                            </Tag>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='content'>
                    {content && <div>{content.content}</div>}
                  </div>
                  <div className='action'>
                    <Button
                      intent={Intent.PRIMARY}
                      onClick={createClarificationChooseHandler(clarification)}
                    >
                      Show Detail
                    </Button>
                  </div>
                </Card>
              )
            })}
        </div>
        {!loading ? (
          <Card className='clarification-form-panel'>
            <CreateClarificationForm />
          </Card>
        ) : (
          <div className='bp3-skeleton'>{'fake content'.repeat(100)}</div>
        )}
      </div>
    )
  }
}

export default ClarificationsView
