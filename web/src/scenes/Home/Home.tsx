import React, { FunctionComponent } from 'react'
import { usePublicOnly } from 'ugrade/auth'
import { useTitle } from 'ugrade/common/title'
import { usePush } from 'ugrade/router'
import { HomeView } from './HomeView'

export const Home: FunctionComponent = () => {
  usePublicOnly()
  useTitle('UGrade | Home')
  const push = usePush()
  return (
    <HomeView
      onLogoClick={push.bind(null, '/')}
      onEnterContest={push.bind(null, '/enter-contest')}
      onCreateContest={push.bind(null, '/create-contest')}
      onSettingClick={push.bind(null, '/setting')}
    />
  )
}
