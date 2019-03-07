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
import 'github-markdown-css'
import lodash from 'lodash'
import moment from 'moment'
import React, { FunctionComponent, useState } from 'react'
import { Clarification } from 'ugrade/contest/store'
import { ClarificationDetail } from './ClarificationDetail'
import { CreateClarificationForm } from './CreateClarificationForm'

import './styles.css'

export interface ClarificationsViewProps {
  clarifications: Clarification[]
  serverClock: Date
}

export const ClarificationsView: FunctionComponent<ClarificationsViewProps> = ({
  clarifications,
  serverClock,
}) => {
  const [currentClarif, setCurrentClarif] = useState(undefined as
    | string
    | undefined)
  const currentMoment = moment(serverClock)
  const genSetClarif = (val?: string) => () => setCurrentClarif(val)

  return (
    <div className='contest-clarifications'>
      {currentClarif && (
        <ClarificationDetail
          clarificationId={currentClarif}
          handleClose={genSetClarif()}
        />
      )}
      <H1 className='header'>Clarifications</H1>
      <div>
        {clarifications.length === 0 && <H3>No Clarifications Yet</H3>}

        {clarifications.map(clarification => {
          const entries = lodash
            .values(clarification.entries)
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
                  onClick={genSetClarif(clarification.id)}
                >
                  Show Detail
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
      <Card className='clarification-form-panel'>
        <CreateClarificationForm />
      </Card>
    </div>
  )
}
