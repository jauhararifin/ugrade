import {
  Alert,
  Button,
  Card,
  Divider,
  H1,
  H3,
  H4,
  Intent,
} from '@blueprintjs/core'
import classnames from 'classnames'
import React, { Fragment, FunctionComponent, useState } from 'react'
import { Link } from 'react-router-dom'
import { Problem } from 'ugrade/contest/store'
import { Navigator } from 'ugrade/router/Navigator'

import './styles.css'

export interface ProblemsViewProps {
  problems?: Problem[]
  onDisable?: (problem: Problem) => any
  onDelete?: (problem: Problem) => any
  canCreate: boolean
  canRead: boolean
  canUpdate: boolean
  canDelete: boolean
}

export const ProblemsView: FunctionComponent<ProblemsViewProps> = ({
  problems,
  onDisable,
  onDelete,
  canCreate,
  canDelete,
  canRead,
  canUpdate,
}) => {
  const [currentDelete, setCurrentDelete] = useState(undefined as
    | Problem
    | undefined)

  const renderAlertDelete = () => {
    if (canDelete && currentDelete) {
      const cancelAlert = () => setCurrentDelete(undefined)
      const onConfirm = async () => {
        if (onDelete) onDelete(currentDelete)
        setCurrentDelete(undefined)
      }
      return (
        <Alert
          cancelButtonText='Cancel'
          confirmButtonText='Delete'
          icon='trash'
          intent={Intent.DANGER}
          isOpen={true}
          onCancel={cancelAlert}
          onConfirm={onConfirm}
        >
          <p>
            Are you sure you want to Delete problem <b>{currentDelete.name}</b>.
            This problem will deleted forever and you cannot achieve it again.
          </p>
        </Alert>
      )
    }
    return null
  }

  const renderCardActions = (problem: Problem) => {
    const handleDelete = () => setCurrentDelete(problem)
    const handleDisable = () => {
      if (onDisable) onDisable(problem)
    }
    return (
      <div className='actions'>
        {canUpdate && (
          <Fragment>
            <Button
              onClick={handleDisable}
              intent={Intent.PRIMARY}
              icon='disable'
              minimal={true}
            />
            <Navigator to={`/contest/problems/${problem.id}/edit`}>
              <Button intent={Intent.PRIMARY} icon='edit' minimal={true} />
            </Navigator>
          </Fragment>
        )}
        {canDelete && (
          <Fragment>
            <Divider />
            <Button
              intent={Intent.DANGER}
              icon='trash'
              minimal={true}
              onClick={handleDelete}
            />
          </Fragment>
        )}
      </div>
    )
  }

  const renderProblemCard = (problem: Problem) => {
    return (
      <Card
        interactive={true}
        key={problem.id}
        className={classnames('item', { disabled: problem.disabled })}
      >
        <div className='header'>
          <Link to={`/contest/problems/${problem.id}`}>
            <H4 disabled={problem.disabled} className='title'>
              {problem.name}
            </H4>
          </Link>
          {renderCardActions(problem)}
        </div>
      </Card>
    )
  }

  const renderNoProblems = () => (
    <H3>
      No Problems
      {canCreate && <Link to={`/contest/problems/create`}>, Create New</Link>}
    </H3>
  )

  const renderActions = () => (
    <div className='actions'>
      {canCreate && (
        <Navigator to={`/contest/problems/create`}>
          <Button intent={Intent.SUCCESS} icon='plus'>
            New
          </Button>
        </Navigator>
      )}
    </div>
  )

  const renderProblems = () => {
    if (!canRead) return null
    if (problems) {
      if (problems.length === 0) return renderNoProblems()
      return (
        <div>
          {renderActions()}
          {problems.map(renderProblemCard)}
        </div>
      )
    }
    return (
      <Card className='bp3-skeleton item'>{'lorem ipsum'.repeat(100)}</Card>
    )
  }

  return (
    <div className='contest-problems'>
      <H1 className='header'>Problems</H1>
      {renderAlertDelete()}
      <div>{renderProblems()}</div>
    </div>
  )
}
