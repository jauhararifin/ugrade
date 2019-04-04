import { useMatch, useRouting } from '@/routing'

export function useReset() {
  const routingStore = useRouting()
  return () => {
    routingStore.replace('/enter-contest')
  }
}

export function useResetAccount() {
  const routingStore = useRouting()
  const [, contestId] = useMatch(/enter-contest\/([0-9]+)/)
  return () => {
    routingStore.replace(`/enter-contest/${contestId}/users/`)
  }
}
