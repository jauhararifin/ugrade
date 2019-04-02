import { useRouting } from '@/routing'

export function useReset() {
  const routingStore = useRouting()
  return () => {
    routingStore.replace('/enter-contest')
  }
}

export function useResetAccount(contestId: string) {
  const routingStore = useRouting()
  return () => {
    routingStore.replace(`/enter-contest/${contestId}/enter-email`)
  }
}
