import { useMappedState } from 'redux-react-hook'
import { useAppDispatch } from 'ugrade/common'
import { ContestInfo, getContestInfo, setInfo } from './store'

export function useContestInfo(): [
  ContestInfo | undefined,
  (info: ContestInfo) => any
] {
  const contestInfo = useMappedState(getContestInfo)
  const dispatch = useAppDispatch()
  return [contestInfo, (info: ContestInfo) => dispatch(setInfo(info))]
}
