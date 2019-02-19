import { Card, Classes, Drawer, H5 } from '@blueprintjs/core'
import moment from 'moment'
import React, { FunctionComponent } from 'react'

import './styles.scss'

import { ISubmission } from '../SubmissionsView'

export interface SubmissionDetailViewProps {
  submission?: ISubmission
  handleClose: () => any
  serverClock: Date
  sourceCodeContent?: string
}

export const SubmissionDetailView: FunctionComponent<
  SubmissionDetailViewProps
> = ({ submission, handleClose, serverClock, sourceCodeContent }) => {
  const currentMoment = moment(serverClock || new Date())
  return (
    <Drawer
      icon='info-sign'
      isOpen={!!submission}
      onClose={handleClose}
      title={submission && `Submission #${submission.id}`}
      className='submission-detail'
    >
      {submission && (
        <div className={Classes.DRAWER_BODY}>
          <div className={Classes.DIALOG_BODY}>
            <div className='info'>
              <H5>{`For Problem ${submission.problem.name}`}</H5>
              <p>{moment(submission.issuedTime).from(currentMoment)}</p>
            </div>
            <div className='info'>
              <H5>{`Using Language ${submission.language.name}`}</H5>
            </div>
            {sourceCodeContent && (
              <div className='info'>
                <Card className='source-code'>
                  <pre>{sourceCodeContent}</pre>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </Drawer>
  )
}
