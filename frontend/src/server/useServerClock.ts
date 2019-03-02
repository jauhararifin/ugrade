import { useEffect, useState } from 'react'
import { useMappedState } from 'redux-react-hook'
import { getClock } from './store'
import { useLoadServerClock } from './useLoadServerClock'

export function useServerClock() {
  useLoadServerClock()
  const [clock, setClock] = useState(undefined as Date | undefined)
  const [current, setCurrent] = useState(new Date())
  const clockStat = useMappedState(getClock)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(new Date())
    }, 1000)
    return clearInterval.bind(null, timer)
  }, [])

  useEffect(() => {
    if (clockStat.clock) {
      const now = Date.now()
      const localClock = clockStat.localClock.getTime()
      const serverClock = clockStat.clock.getTime()
      setClock(new Date(now + serverClock - localClock))
    } else if (clock) setClock(undefined)
  }, [current, clockStat])

  return clock
}
