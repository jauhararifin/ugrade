import { useObservable } from 'mobx-react-lite'
import { ServerStore } from './store'

export const serverStore = new ServerStore()

export function useServer(): ServerStore {
  return useObservable(serverStore)
}
