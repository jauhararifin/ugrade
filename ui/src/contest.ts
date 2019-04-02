import { observable } from 'mobx'
import { createContext, useContext } from 'react'

export const contestStore = observable({
  contestId: undefined as number | undefined,
  userId: undefined as number | undefined,
  constructor() {},
})
export const contestContext = createContext(contestStore)
export function useContest() {
  return useContext(contestContext)
}
