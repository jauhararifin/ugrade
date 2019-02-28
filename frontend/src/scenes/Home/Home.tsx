import React, { FunctionComponent } from 'react'

import usePublicOnly from '../../helpers/usePublicOnly'
import usePush from '../../helpers/usePush'
import useTitle from '../../helpers/useTitle'
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
