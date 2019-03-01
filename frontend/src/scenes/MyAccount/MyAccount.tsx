import React, { FunctionComponent } from 'react'
import { useContestOnly, useMe } from 'ugrade/auth'
import { useTitle } from 'ugrade/common/title'
import { MyAccountView } from './MyAccountView'

export const MyAccount: FunctionComponent = () => {
  useContestOnly()
  useTitle('UGrade | My Account')
  const me = useMe()
  return <MyAccountView loading={!me} />
}
