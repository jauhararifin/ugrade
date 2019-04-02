import { observable } from 'mobx'
import { createContext, useContext } from 'react'

export const windowStore = observable({
  online: true,
})

export const windowContext = createContext(windowStore)

export const useWindow = () => useContext(windowContext)

window.addEventListener('keydown', (ev: KeyboardEvent) => {
  if (ev && ev.keyCode === 27) {
    windowStore.online = !windowStore.online
  }
})
