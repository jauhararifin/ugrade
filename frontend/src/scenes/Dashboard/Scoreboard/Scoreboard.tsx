import React, { FunctionComponent } from 'react'
import { useProblemList } from 'ugrade/contest/problem'
import { useScoreboard } from 'ugrade/contest/scoreboard'
import { ScoreboardLoadingView } from './ScoreboardLoadingView'
import { ScoreboardView } from './ScoreboardView'

export const Scoreboard: FunctionComponent = () => {
  const scoreboard = useScoreboard()
  const problems = useProblemList()

  if (!problems || !scoreboard) return <ScoreboardLoadingView />

  return <ScoreboardView problems={problems} scoreboard={scoreboard} />
}
