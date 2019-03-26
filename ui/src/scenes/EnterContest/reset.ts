import { useAuth, useContest, useRouting } from '../../app'

export function useReset() {
  const routingStore = useRouting()
  const contestStore = useContest()
  const authStore = useAuth()
  return () => {
    routingStore.push('/enter-contest')
    contestStore.current = undefined
    authStore.me = undefined
  }
}
