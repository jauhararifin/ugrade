import { useContest } from '@/contest'
import { useRouting } from '@/routing'

export function useReset() {
  const routingStore = useRouting()
  const contestStore = useContest()
  return () => {
    routingStore.replace('/enter-contest')
    contestStore.contestId = undefined
    contestStore.userId = undefined
  }
}

export function useResetAccount() {
  const routingStore = useRouting()
  const contestStore = useContest()
  return () => {
    routingStore.replace(`/enter-contest/${contestStore.contestId}/enter-email`)
    contestStore.userId = undefined
  }
}
