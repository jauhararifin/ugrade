import {
  Button,
  Card,
  Classes,
  Drawer,
  H5,
  Intent,
  Label,
  TextArea,
} from '@blueprintjs/core'
import moment from 'moment'
import React, { FunctionComponent } from 'react'
import { Clarification } from '../../../stores/Contest'

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
      className='clarif-detail'
    >
      {clarification && (
        <React.Fragment>
          <div className={Classes.DRAWER_BODY}>
            <div className={Classes.DIALOG_BODY}>
              <div className='info'>
                <H5>{clarification.subject}</H5>
                <p>{moment(clarification.issuedTime).from(currentMoment)}</p>
              </div>
              <div className='content'>
                {clarification.entries.map(entry => (
                  <Card className='entry' elevation={entry.read ? 0 : 2}>
                    <div className='info'>
                      <H5>From: {entry.sender}</H5>
                      <p>{moment(entry.issuedTime).from(currentMoment)}</p>
                    </div>
                    <p>{entry.content}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <div className={Classes.DRAWER_FOOTER}>
            <form className='reply-form'>
              <TextArea
                className='reply-message'
                rows={3}
                fill={true}
                placeholder='Reply the clarifications here...'
              />
              <div className='send-reply'>
                <Button
                  intent={Intent.PRIMARY}
                  minimal={true}
                  fill={true}
                  icon='circle-arrow-right'
                />
              </div>
            </form>
          </div>
        </React.Fragment>
      )}
    </Drawer>
  )
}
