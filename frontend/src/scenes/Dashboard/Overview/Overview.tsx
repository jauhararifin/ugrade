import React, { FunctionComponent } from 'react'
import { useContestOnly, usePermissions } from 'ugrade/auth'
import { UserPermission } from 'ugrade/auth/store'
import { useContestInfo } from 'ugrade/contest'
import { OverviewView } from './OverviewView'

export const Overview: FunctionComponent = () => {
  useContestOnly()
  const contest = useContestInfo()
  const canEdit = usePermissions([UserPermission.InfoUpdate])

  return <OverviewView canEdit={canEdit} contest={contest} />
}
