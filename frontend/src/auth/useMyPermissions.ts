import lodash from 'lodash'
import { useMe } from './useMe'

export function useMyPermissions() {
  const me = useMe()
  if (!me) return undefined
  return lodash.cloneDeep(me.permissions)
}
