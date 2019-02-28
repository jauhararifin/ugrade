import { useEffect } from 'react'
import { usePush } from 'ugrade/router/usePush'
import { useIsSignedIn } from './useIsSignedIn'

export function usePublicOnly(to: string = '/contest') {
  const push = usePush()
  const isSignedIn = useIsSignedIn()
  useEffect(() => {
    if (isSignedIn) push(to)
  }, [isSignedIn])
}
