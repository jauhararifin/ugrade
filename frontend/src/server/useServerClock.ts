import { useEffect, useState } from 'react'
import { useMappedState } from 'redux-react-hook'
import { clearInterval } from 'timers'
import { getClock } from './store'

export function useServerClock() {
  const [clock, setClock] = useState(undefined as Date | undefined)
  const clockStat = useMappedState(getClock)
  useEffect(() => {
    const tid = setInterval(() => {
      if (clockStat.clock) {
        const now = Date.now()
        const localClock = clockStat.localClock.getTime()
        const serverClock = clockStat.clock.getTime()
        setClock(new Date(now + serverClock - localClock))
      }
      if (clock) setClock(undefined)
    }, 1000)
    return clearInterval.bind(null, tid)
  }, [])
  return clock
}
