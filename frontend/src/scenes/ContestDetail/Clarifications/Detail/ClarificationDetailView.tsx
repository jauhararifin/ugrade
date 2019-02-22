import { Card, Classes, Drawer, H5, Tooltip } from '@blueprintjs/core'
import moment from 'moment'
import React, { FunctionComponent } from 'react'

import './styles.scss'

import { Clarification } from '../../../../stores/Contest'
import CreateClarificationEntryForm from './CreateClarificationEntryForm'

export interface ClarificationDetailViewProps {
  clarification?: Clarification
  handleClose: () => any
  serverClock: Date
}

export const ClarificationDetailView: FunctionComponent<
  ClarificationDetailViewProps
> = ({ clarification, handleClose, serverClock }) => {
  const currentMoment = moment(serverClock || new Date())
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
                {clarification.entries.map(entry => (
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
