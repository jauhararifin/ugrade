import { Clarification as ServiceClarification } from 'ugrade/services/contest/Clarification'
import { Clarification, ClarificationEntry } from 'ugrade/stores/Contest'

export function normalizeClarification(
  clarification: ServiceClarification
): Clarification {
  const entries: { [id: string]: ClarificationEntry } = {}
  clarification.entries.forEach(entry => (entries[entry.id] = entry))
  return {
    ...clarification,
    entries,
  }
}
