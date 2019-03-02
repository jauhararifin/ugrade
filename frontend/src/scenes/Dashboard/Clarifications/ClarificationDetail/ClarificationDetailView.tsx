import { Card, Classes, Drawer, H5, Tooltip } from '@blueprintjs/core'
import lodash from 'lodash'
import moment from 'moment'
import React, { FunctionComponent } from 'react'
import { Clarification } from 'ugrade/contest/store'
import { CreateClarificationEntryForm } from './CreateClarificationEntryForm'

import './styles.scss'

export interface ClarificationDetailViewProps {
  clarification?: Clarification
  handleClose: () => any
  serverClock?: Date
}

export const ClarificationDetailView: FunctionComponent<
  ClarificationDetailViewProps
> = ({ clarification, handleClose, serverClock }) => {
  const currentMoment = moment(serverClock || new Date())
  const entries = clarification ? lodash.values(clarification.entries) : []
  return (
    <Drawer
      icon='info-sign'
      isOpen={!!clarification}
      onClose={handleClose}
      title={clarification && clarification.title}
      className='clarification-detail'
    >
      {clarification && (
        <React.Fragment>
          <div className={Classes.DRAWER_BODY}>
            <div className={Classes.DIALOG_BODY}>
              <div className='info'>
                <H5>{clarification.subject}</H5>
                <p>
                  <Tooltip
                    className={Classes.TOOLTIP_INDICATOR}
                    content={moment(clarification.issuedTime).format(
                      'dddd, MMMM Do YYYY, h:mm:ss a'
                    )}
                  >
                    {moment(clarification.issuedTime).from(currentMoment)}
                  </Tooltip>
                </p>
              </div>
              <div className='content'>
                {entries
                  .sort(
                    (a, b) => b.issuedTime.getTime() - a.issuedTime.getTime()
                  )
                  .map(entry => (
                    <Card
                      key={entry.id}
                      className='entry'
                      elevation={entry.read ? 0 : 2}
                    >
                      <div className='info'>
                        <H5>From: {entry.sender}</H5>
                        <p>
                          <Tooltip
                            className={Classes.TOOLTIP_INDICATOR}
                            content={moment(entry.issuedTime).format(
                              'dddd, MMMM Do YYYY, h:mm:ss a'
                            )}
                          >
                            {moment(entry.issuedTime).from(currentMoment)}
                          </Tooltip>
                        </p>
                      </div>
                      <p>{entry.content}</p>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
          <div className={Classes.DRAWER_FOOTER}>
            <CreateClarificationEntryForm clarificationId={clarification.id} />
          </div>
        </React.Fragment>
      )}
    </Drawer>
  )
}
