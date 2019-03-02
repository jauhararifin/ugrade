import lodash from 'lodash'
import React, { FunctionComponent, useMemo } from 'react'
import { useUsers } from 'ugrade/auth'
import { useProblemList } from 'ugrade/contest/problem'
import { useScoreboard } from 'ugrade/contest/scoreboard'
import { ScoreboardView } from './ScoreboardView'

export const Scoreboard: FunctionComponent = () => {
  const scoreboard = useScoreboard()
  const problems = useProblemList()
  const usernames = useMemo(
    () => (scoreboard ? scoreboard.entries.map(v => v.contestant) : []),
    [scoreboard]
  )
  const users = useUsers(usernames)
  const userMap = lodash.zipObject(users.map(u => u.username), users)

  return (
    <ScoreboardView
      problems={problems}
      scoreboard={scoreboard}
      userMap={userMap}
    />
  )
}
