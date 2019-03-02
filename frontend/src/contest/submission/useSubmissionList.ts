import { useMappedState } from 'redux-react-hook'
import { getSubmissionList } from '../store'
import { useSubmissions } from './useSubmissions'

export function useSubmissionList() {
  useSubmissions()
  return useMappedState(getSubmissionList)
}
