import {
  Button,
  Card,
  Classes,
  Elevation,
  H1,
  H3,
  H5,
  Intent,
  Tag,
  Tooltip,
} from '@blueprintjs/core'
import classnames from 'classnames'
import 'github-markdown-css'
import moment from 'moment'
import React, { FunctionComponent, useState } from 'react'
import { Clarification, Problem } from 'ugrade/contest/store'
import { ClarificationDetail } from './ClarificationDetail'
import { CreateClarificationForm } from './CreateClarificationForm'

import './styles.css'

export interface ClarificationsViewProps {
  clarifications?: Clarification[]
  problems?: Problem[]
  serverClock?: Date
}

export const ClarificationsView: FunctionComponent<ClarificationsViewProps> = ({
  clarifications,
  problems,
  serverClock,
}) => {
  const [currentClarif, setCurrentClarif] = useState(undefined as
    | string
    | undefined)

  const loading = !clarifications || !problems
  const currentMoment = moment(serverClock || new Date())

  return (
    <div className='contest-clarifications'>
      {serverClock && currentClarif && (
        <ClarificationDetail
          clarificationId={currentClarif}
          handleClose={setCurrentClarif.bind(null, undefined)}
        />
      )}
      <H1 className={classnames('header', { 'bp3-skeleton': loading })}>
        Clarifications
      </H1>
      <div>
        {loading && (
          <Card className='bp3-skeleton item'>{'lorem ipsum'.repeat(100)}</Card>
        )}

        {!loading && clarifications && clarifications.length === 0 && (
          <H3>No Clarifications Yet</H3>
        )}

        {!loading &&
          clarifications &&
          clarifications.map(clarification => {
            const entries = Object.keys(clarification.entries)
              .map(k => clarification.entries[k])
              .sort((a, b) => a.issuedTime.getTime() - b.issuedTime.getTime())
            const notReadCount = entries.filter(entry => !entry.read).length
            const content = entries[0]
            return (
              <Card
                key={clarification.id}
                className='item'
                elevation={notReadCount === 0 ? Elevation.ZERO : Elevation.TWO}
              >
                <div className='header'>
                  <H5 className='subject'>{clarification.subject}</H5>
                  <H3 className='title'>{clarification.title}</H3>
                  <div className='info'>
                    <div className='info-container'>
                      <p className='time'>
                        <Tooltip
                          className={Classes.TOOLTIP_INDICATOR}
                          content={moment(clarification.issuedTime).format(
                            'dddd, MMMM Do YYYY, h:mm:ss a'
                          )}
                        >
                          {moment(clarification.issuedTime).from(currentMoment)}
                        </Tooltip>
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
                    onClick={setCurrentClarif.bind(null, clarification.id)}
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
