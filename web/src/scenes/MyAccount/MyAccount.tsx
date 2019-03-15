import React, { FunctionComponent } from 'react'
import { useContestOnly, useMe } from 'ugrade/auth'
import { useTitle } from 'ugrade/common/title'
import { MyAccountLoadingView } from './MyAccountLoadingView'
import { MyAccountView } from './MyAccountView'

export const MyAccount: FunctionComponent = () => {
  useContestOnly()
  useTitle('UGrade | My Account')
  const me = useMe()
  const loading = !me
  if (loading) return <MyAccountLoadingView />
  return <MyAccountView />
}
