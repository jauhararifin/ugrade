import { useEffect } from 'react'
import { usePush } from 'ugrade/router/usePush'
import { useIsSignedIn } from './useIsSignedIn'
import { useToken } from './useToken'

export function useContestOnly(to: string = '/enter-contest') {
  const push = usePush()
  const isSignedIn = useIsSignedIn()
  const token = useToken()
  useEffect(() => {
    if (!isSignedIn || token.length === 0) push(to)
  }, [isSignedIn])
}
