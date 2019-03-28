import { useAuth, useRouting } from '@/app'
import { useEffect } from 'react'

export function usePublicOnly(to: string = '/contest') {
  const routing = useRouting()
  const auth = useAuth()
  const isSignedIn = auth.token.length > 0
  useEffect(() => {
    if (isSignedIn) routing.push(to)
  }, [isSignedIn])
}

export function useContestOnly(to: string = '/enter-contest') {
  const routing = useRouting()
  const auth = useAuth()
  const isSignedIn = auth.token.length > 0
  useEffect(() => {
    if (!isSignedIn) routing.push(to)
  }, [isSignedIn])
}
