import { useAuth } from '@/app'
import { title, usePublicOnly } from '@/common'
import React, { FunctionComponent } from 'react'
import { HomeView } from './HomeView'

export const Home: FunctionComponent = () => {
  usePublicOnly()
  title('UGrade | Home')
  const authStore = useAuth()
  if (authStore.token.length > 0) return <React.Fragment />
  return <HomeView />
}
