import lodash from 'lodash'
import { AuthService, Permission } from 'ugrade/auth'
import { Clarification, ClarificationEntry } from '../clarification'
import { NoSuchClarification } from '../NoSuchClarification'
import { ClarificationService } from '../service'
import { clarificationServiceValidator } from '../validation'

export class InMemoryClarificationService implements ClarificationService {
  private authService: AuthService
  private clarifications: Clarification[]
  private idClarifications: { [id: string]: Clarification }
  private entries: ClarificationEntry[]
  private idEntries: { [id: string]: ClarificationEntry }

  constructor(
    authService: AuthService,
    clarifications: Clarification[] = [],
    entries: ClarificationEntry[] = []
  ) {
    this.authService = authService

    this.clarifications = lodash.cloneDeep(clarifications)
    this.idClarifications = {}
    for (const clarif of this.clarifications) {
      this.idClarifications[clarif.id] = clarif
    }

    this.entries = lodash.cloneDeep(entries)
    this.idEntries = {}
    for (const entry of this.entries) this.idEntries[entry.id] = entry
  }

  async getClarificationById(
    token: string,
    clarificationId: string
  ): Promise<Clarification> {
    await clarificationServiceValidator.getClarificationById(
      token,
      clarificationId
    )

    // throw NoSuchClarification
    if (!this.idClarifications[clarificationId]) throw new NoSuchClarification()

    // throw NoSuchClarification if clarification in different contest
    const clarification = this.idClarifications[clarificationId]
    const me = await this.authService.getMe(token)
    const issuer = await this.authService.getUserById(clarification.issuerId)
    if (me.contestId !== issuer.contestId) throw new NoSuchClarification()

    // if has no permission to read all clarification
    // and not own target clarification
    if (
      !me.permissions.includes(Permission.ClarificationsRead) &&
      me.id !== clarification.issuerId
    ) {
      throw new NoSuchClarification()
    }

    return lodash.cloneDeep(clarification)
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
