import { useMappedState } from 'redux-react-hook'
import { AppState } from 'ugrade/stores'

export function useLocation() {
  return useMappedState((state: AppState) => state.router.location)
}
