import { useEffect, useState } from 'react'
import { useMappedState } from 'redux-react-hook'
import { getClock } from './store'
import { useLoadServerClock } from './useLoadServerClock'

export function useServerClock(refreshRate: number = 1000) {
  const clockStat = useMappedState(getClock)

  function calculateNow() {
    if (clockStat.clock) {
      const now = Date.now()
      const localClock = clockStat.localClock.getTime()
      const serverClock = clockStat.clock.getTime()
      return new Date(now + serverClock - localClock)
    }
    return undefined
  }

  useLoadServerClock()
  const [clock, setClock] = useState(calculateNow())
  const [current, setCurrent] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(new Date())
    }, refreshRate)
    return clearInterval.bind(null, timer)
  }, [])

  useEffect(() => {
    if (clockStat.clock) {
      setClock(calculateNow())
    } else if (clock) setClock(undefined)
  }, [current, clockStat])

  return calculateNow() || clock
}
