import { useMappedState } from 'redux-react-hook'
import { AppState } from 'ugrade/store'

export function useLocation() {
  return useMappedState((state: AppState) => state.router.location)
}
