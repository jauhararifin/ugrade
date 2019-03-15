import { AppState } from 'ugrade/store'

export function getUserProfile(state: AppState) {
  return state.userProfile
}
