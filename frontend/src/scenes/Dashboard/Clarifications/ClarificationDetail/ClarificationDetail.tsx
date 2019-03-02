import React, { FunctionComponent, useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'
import { useContestOnly } from 'ugrade/auth'
import {
  useClarifications,
  useReadClarificationEntries,
} from 'ugrade/contest/clarification'
import { getUnReadClarification } from 'ugrade/contest/store'
import { useServerClock } from 'ugrade/server'
import { ClarificationDetailView } from './ClarificationDetailView'

export interface ClarificationDetailProps {
  clarificationId: string
  handleClose: () => any
}

export const ClarificationDetail: FunctionComponent<
  ClarificationDetailProps
> = ({ clarificationId, handleClose }) => {
  useContestOnly()
  const clarifications = useClarifications()
  const unreadClarificationList = useMappedState(getUnReadClarification)
  const serverClock = useServerClock()

  const clarification = clarifications
    ? clarifications[clarificationId]
    : undefined

  const readClarificationEntries = useReadClarificationEntries()

  const readAllEntries = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000)) // read after 2 seconds
    const unreadEntries = unreadClarificationList[clarificationId] || []
    if (unreadEntries.length > 0) {
      readClarificationEntries(clarificationId, unreadEntries)
    }
  }

  useEffect(() => {
    readAllEntries().catch(_ => null)
  })

  return (
    <ClarificationDetailView
      clarification={clarification}
      handleClose={handleClose}
      serverClock={serverClock}
    />
  )
}
