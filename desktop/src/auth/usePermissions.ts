import { UserPermission } from './store'
import { useMe } from './useMe'

export function usePermissions(permissionNeeded: UserPermission[]) {
  const me = useMe()
  if (!me) return false
  for (const perm of permissionNeeded) {
    if (!me.permissions.includes(perm)) return false
  }
  return true
}
