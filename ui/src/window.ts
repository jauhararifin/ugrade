import { observable } from 'mobx'
import { createContext, useContext, useEffect } from 'react'

export const windowStore = observable({
  title: 'UGrade',
  online: true,
})

export const windowContext = createContext(windowStore)

export const useWindow = () => useContext(windowContext)

export function title(newTitle: string) {
  const window = useWindow()
  useEffect(() => {
    window.title = newTitle
  }, [])
}

window.addEventListener('keydown', (ev: KeyboardEvent) => {
  if (ev && ev.keyCode === 27) {
    windowStore.online = !windowStore.online
  }
})
