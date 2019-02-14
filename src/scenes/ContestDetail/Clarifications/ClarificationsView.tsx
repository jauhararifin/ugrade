import {
  Card,
  Divider,
  Elevation,
  H1,
  H3,
  H5,
  Icon,
  Intent,
} from '@blueprintjs/core'
import classnames from 'classnames'
import 'github-markdown-css'
import moment from 'moment'
import React, { FunctionComponent } from 'react'

import './styles.css'

import { FormikProps } from 'formik'
import { Contest } from '../../../stores/Contest'
import {
  NewClarificationForm,
  NewClarificationFormValue,
} from './NewClarificationForm'

export interface ClarificationsViewProps {
  contest?: Contest
  serverClock?: Date
  clarificationForm: FormikProps<NewClarificationFormValue>
}

export const ClarificationsView: FunctionComponent<ClarificationsViewProps> = ({
  contest,
  serverClock,
  clarificationForm,
}) => {
  const loading = !contest || !contest.clarifications || !contest.problems
  const currentMoment = moment(serverClock || new Date())
  return (
    <div className='contest-clarifications'>
      <H1 className={classnames('header', { 'bp3-skeleton': loading })}>
        Clarifications
      </H1>
      <div>
        {loading && (
          <Card className='bp3-skeleton item'>{'lorem ipsum'.repeat(100)}</Card>
        )}

        {!loading &&
          contest &&
          contest.clarifications &&
          contest.clarifications.length === 0 && <H3>No Clarifications Yet</H3>}

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
                elevation={notReadCount === 0 ? Elevation.ZERO : Elevation.TWO}
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
                          <Icon icon='notifications' intent={Intent.DANGER} />
                          &nbsp;
                          {`${notReadCount} unread message${
                            notReadCount > 1 ? 's' : ''
                          }`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {content && <div>{content.content}</div>}
              </Card>
            )
          })}
      </div>
      {!loading && contest && contest.problems ? (
        <Card className='clarification-form-panel'>
          <NewClarificationForm
            subjectOptions={[
              { label: 'General Issue', value: 'General Issue' },
              { label: 'Technical Issue', value: 'Technical Issue' },
              ...contest.problems.map(problem => ({
                label: `Problem: ${problem.name}`,
                value: `Problem: ${problem.name}`,
              })),
            ]}
            {...clarificationForm}
          />
        </Card>
      ) : (
        <div className='bp3-skeleton'>{'fake content'.repeat(100)}</div>
      )}
    </div>
  )
}

export default ClarificationsView
