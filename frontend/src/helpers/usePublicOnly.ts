import { useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'

import { getIsSignedIn } from '../stores/Auth'
import usePush from './usePush'

export default function usePublicOnly(to: string = '/contest') {
  const push = usePush()
  const isSignedIn = useMappedState(getIsSignedIn)
  useEffect(() => {
    if (isSignedIn) push(to)
  }, [isSignedIn])
}
