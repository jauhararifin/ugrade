import gql from 'graphql-tag'
import { observable, observe, reaction, when } from 'mobx'
import { useDisposable } from 'mobx-react-lite'
import { createContext, useContext, useEffect, useState } from 'react'
import { apolloClient } from './client'

export const windowStore = observable({
  online: true,
  serverClock: undefined as Date | undefined,
})

export const windowContext = createContext(windowStore)

export const useWindow = () => useContext(windowContext)

export function useServerClock() {
  const store = useWindow()
  const [serverClock, setServerClock] = useState(undefined as undefined | Date)
  useDisposable(() => reaction(() => store.serverClock, () => setServerClock(store.serverClock)))
  return serverClock
}

const pollServer = async () => {
  // wait 500ms first, then poll every 10 sec
  await new Promise(resv => setTimeout(resv, 500))

  let currentDelay = 2 ** 32 // latency between server and client when fetching clock
  let serverClockFetched = undefined as Date | undefined // clock returned by server
  let localClockFetched = new Date() // local clock when server return it's clock

  // calculate server clock every second
  setInterval(() => {
    if (serverClockFetched) {
      const clockProb = Date.now() - localClockFetched.getTime() + serverClockFetched.getTime()
      windowStore.serverClock = new Date(clockProb)
    }
  }, 1000)

  while (true) {
    try {
      // get clock from server
      const before = new Date()
      const result = await apolloClient.query({
        query: gql`
          query GetServerStatus {
            serverClock
          }
        `,
        fetchPolicy: 'network-only',
      })
      const after = new Date()

      // update clock when current latency is better
      const delay = after.getTime() - before.getTime()
      if (delay < currentDelay) {
        currentDelay = delay
        serverClockFetched = new Date(result.data.serverClock)
        localClockFetched = new Date((after.getTime() + before.getTime()) / 2)
      }
      windowStore.online = true
    } catch (error) {
      // possibly the server or network is down
      windowStore.online = false
    }

    // wait 10 sec
    await new Promise(resv => setTimeout(resv, 1000))
  }
}

pollServer()
