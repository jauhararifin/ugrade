import { Clarification, ClarificationEntry } from '../clarification'
import { ClarificationService } from '../service'
import { clarificationServiceValidator } from '../validation'

export class InMemoryClarificationService implements ClarificationService {
  async getClarificationById(
    token: string,
    clarificationId: string
  ): Promise<Clarification> {
    await clarificationServiceValidator.getClarificationById(
      token,
      clarificationId
    )
    throw new Error('not yet implemented')
  }

  async getClarificationEntries(
    token: string,
    clarificationId: string
  ): Promise<ClarificationEntry[]> {
    await clarificationServiceValidator.getClarificationEntries(
      token,
      clarificationId
    )
    throw new Error('not yet implemented')
  }

  async getContestClarifications(
    token: string,
    contestId: string
  ): Promise<Clarification[]> {
    await clarificationServiceValidator.getContestClarifications(
      token,
      contestId
    )
    throw new Error('not yet implemented')
  }

  async createClarification(
    token: string,
    title: string,
    subject: string,
    content: string
  ): Promise<Clarification> {
    await clarificationServiceValidator.createClarification(
      token,
      title,
      subject,
      content
    )
    throw new Error('not yet implemented')
  }

  async readClarificationEntry(
    token: string,
    clarificationEntryId: string
  ): Promise<Clarification> {
    await clarificationServiceValidator.readClarificationEntry(
      token,
      clarificationEntryId
    )
    throw new Error('not yet implemented')
  }
}
