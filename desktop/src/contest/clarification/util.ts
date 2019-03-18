import { Clarification as ServiceClarification } from 'ugrade/services/clarification'
import { Clarification, ClarificationEntry } from '../store'

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
