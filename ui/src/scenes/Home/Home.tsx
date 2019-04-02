import { usePublicOnly } from '@/auth'
import { title } from '@/window'
import React, { FunctionComponent } from 'react'
import { HomeView } from './HomeView'

export const Home: FunctionComponent = () => {
  usePublicOnly()
  title('UGrade | Home')
  return <HomeView />
}
