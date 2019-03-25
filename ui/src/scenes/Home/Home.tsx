import React, { FunctionComponent } from 'react'
import { title } from '../../common'
import { HomeView } from './HomeView'

export const Home: FunctionComponent = () => {
  title('UGrade | Home')
  return <HomeView />
}
