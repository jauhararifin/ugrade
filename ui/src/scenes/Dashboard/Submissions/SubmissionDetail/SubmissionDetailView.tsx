import { Card, Classes, Drawer, H5, Tooltip } from '@blueprintjs/core'
import moment from 'moment'
import React, { FunctionComponent } from 'react'

import './styles.scss'

export interface SubmissionDetailViewProps {
  submission?: {
    id: string
    issuedTime: Date
    problem: {
      id: string
      name: string
    }
    language: {
      id: string
      name: string
    }
    verdict: string
  }
  handleClose: () => any
  serverClock?: Date
  sourceCodeContent?: string
}

export const SubmissionDetailView: FunctionComponent<SubmissionDetailViewProps> = ({
  submission,
  handleClose,
  serverClock,
  sourceCodeContent,
}) => {
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
              <p>
                <Tooltip
                  className={Classes.TOOLTIP_INDICATOR}
                  content={moment(submission.issuedTime).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                >
                  {moment(submission.issuedTime).from(currentMoment)}
                </Tooltip>
              </p>
            </div>
            <div className='info'>
              <H5>{`Using Language ${submission.language.name}`}</H5>
            </div>
            {sourceCodeContent ? (
              <div className='info'>
                <Card className='source-code'>
                  <pre>{sourceCodeContent}</pre>
                </Card>
              </div>
            ) : (
              <Card className='bp3-skeleton'>{'lorem ipsum'.repeat(100)}</Card>
            )}
            {/* {submission && submission.gradings && submission.gradings.length === 0 && (
              <div className='info'>
                <H5>No Grading History</H5>
              </div>
            )} */}
            {/* {(!submission || !submission.gradings) && (
              <div className='info'>
                <Card className='bp3-skeleton'>{'lorem ipsum'.repeat(100)}</Card>
              </div> */}
            {/* {submission && submission.gradings && submission.gradings.length > 0 && (
              <div className='content'>
                <div className='entry'>
                  <H2>Grading History</H2>
                </div>
                {submission.gradings.map(grading => (
                  <Card className='entry' key={grading.id}>
                    <div className='info'>
                      <H5>{`Grading #${grading.id}`}</H5>
                      <p className='grading-info'>
                        <span>
                          <Tooltip
                            className={Classes.TOOLTIP_INDICATOR}
                            content={moment(grading.issuedTime).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                          >
                            {moment(grading.issuedTime).from(currentMoment)}
                          </Tooltip>
                        </span>
                        <Divider />
                        {renderVerdict(grading.verdict)}
                      </p>
                    </div>
                    {grading.message.length > 0 && <p>grading.message</p>}
                    {grading.compilationOutput.length > 0 && (
                      <Callout className='source-code'>
                        <H5>Compilation Output</H5>
                        <pre>{grading.compilationOutput}</pre>
                      </Callout>
                    )}
                  </Card>
                ))}
              </div>
            )} */}
          </div>
        </div>
      )}
    </Drawer>
  )
}
