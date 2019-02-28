import { useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'

import { usePush } from 'ugrade/router/usePush'
import { getIsSignedIn } from 'ugrade/stores/Auth'

export function usePublicOnly(to: string = '/contest') {
  const push = usePush()
  const isSignedIn = useMappedState(getIsSignedIn)
  useEffect(() => {
    if (isSignedIn) push(to)
  }, [isSignedIn])
}
