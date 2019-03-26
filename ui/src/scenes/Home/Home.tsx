import React, { FunctionComponent } from 'react'
import { title, usePublicOnly } from '../../common'
import { HomeView } from './HomeView'

export const Home: FunctionComponent = () => {
  usePublicOnly()
  title('UGrade | Home')
  return <HomeView />
}
