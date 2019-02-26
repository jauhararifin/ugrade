import { Clarification as ServiceClarification } from '../../../services/contest/Clarification'
import { Clarification, ClarificationEntry } from '../../../stores/Contest'

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
