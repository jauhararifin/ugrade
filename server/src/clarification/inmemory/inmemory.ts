import lodash from 'lodash'
import { AuthService, ForbiddenAction, Permission } from 'ugrade/auth'
import { genUUID } from 'ugrade/uuid'
import { Clarification, ClarificationEntry } from '../clarification'
import { NoSuchClarification } from '../NoSuchClarification'
import { NoSuchClarificationEntry } from '../NoSuchClarificationEntry'
import { ClarificationService } from '../service'
import { clarificationServiceValidator as validator } from '../validation'

export class InMemoryClarificationService implements ClarificationService {
  private authService: AuthService
  private clarifications: Clarification[]
  private idClarifications: { [id: string]: Clarification }
  private entries: ClarificationEntry[]
  private idEntries: { [id: string]: ClarificationEntry }
  private entryRead: { [key: string]: boolean }

  constructor(authService: AuthService, clarifications: Clarification[] = [], entries: ClarificationEntry[] = []) {
    this.authService = authService

    this.clarifications = lodash.cloneDeep(clarifications)
    this.idClarifications = {}
    for (const clarif of this.clarifications) {
      this.idClarifications[clarif.id] = clarif
    }

    this.entries = lodash.cloneDeep(entries)
    this.idEntries = {}
    for (const entry of this.entries) this.idEntries[entry.id] = entry

    this.entryRead = {}
  }

  async getClarificationById(token: string, clarificationId: string): Promise<Clarification> {
    await validator.getClarificationById(token, clarificationId)

    // throw NoSuchClarification
    if (!this.idClarifications[clarificationId]) throw new NoSuchClarification()

    // throw NoSuchClarification if clarification in different contest
    const clarification = this.idClarifications[clarificationId]
    const me = await this.authService.getMe(token)
    if (me.contestId !== clarification.contestId) {
      throw new NoSuchClarification()
    }

    // if has no permission to read all clarification
    // and not own target clarification
    if (!me.permissions.includes(Permission.ClarificationsRead) && me.id !== clarification.issuerId) {
      throw new NoSuchClarification()
    }

    return lodash.cloneDeep(clarification)
  }

  async getClarificationEntries(token: string, clarificationId: string): Promise<ClarificationEntry[]> {
    await validator.getClarificationEntries(token, clarificationId)
    const clarif = await this.getClarificationById(token, clarificationId)
    const me = await this.authService.getMe(token)
    const result = clarif.entryIds.map(i => this.idEntries[i]).map(this.readWrapper(me.id))
    return lodash.cloneDeep(result)
  }

  async getContestClarifications(token: string, contestId: string): Promise<Clarification[]> {
    await validator.getContestClarifications(token, contestId)

    const me = await this.authService.getMe(token)
    if (me.contestId !== contestId) throw new ForbiddenAction()

    const result = this.clarifications.filter(
      clarif =>
        clarif.contestId === contestId &&
        (me.permissions.includes(Permission.ClarificationsRead) || clarif.issuerId === me.id)
    )

    return lodash.cloneDeep(result)
  }

  async createClarification(token: string, title: string, subject: string, content: string): Promise<Clarification> {
    await validator.createClarification(token, title, subject, content)

    const me = await this.authService.getMe(token)
    if (!me.permissions.includes(Permission.ClarificationsCreate)) {
      throw new ForbiddenAction()
    }

    const [clarifId, entryId] = [genUUID(), genUUID()]
    const newEntry: ClarificationEntry = {
      id: entryId,
      clarificationId: clarifId,
      senderId: me.id,
      content,
      issuedTime: new Date(),
      read: true,
    }
    const newClarification: Clarification = {
      id: clarifId,
      contestId: me.contestId,
      title,
      subject,
      issuerId: me.id,
      issuedTime: new Date(),
      entryIds: [entryId],
    }

    this.clarifications.push(newClarification)
    this.idClarifications[newClarification.id] = newClarification
    this.entries.push(newEntry)
    this.idEntries[newEntry.id] = newEntry
    this.entryRead[`${me.id}:${clarifId}`] = true

    return lodash.cloneDeep(newClarification)
  }

  async replyClarification(token: string, clarificationId: string, content: string): Promise<ClarificationEntry> {
    await validator.replyClarification(token, clarificationId, content)

    const me = await this.authService.getMe(token)
    if (!me.permissions.includes(Permission.ClarificationsCreate)) {
      throw new ForbiddenAction()
    }

    const clarification = await this.getClarificationById(token, clarificationId)
    const newEntry: ClarificationEntry = {
      id: genUUID(),
      clarificationId: clarification.id,
      senderId: me.id,
      content,
      issuedTime: new Date(),
      read: true,
    }

    this.idClarifications[clarification.id].entryIds.push(newEntry.id)
    this.entries.push(newEntry)
    this.idEntries[newEntry.id] = newEntry
    this.entryRead[`${me.id}:${newEntry.id}`] = true

    return lodash.cloneDeep(newEntry)
  }

  async readClarificationEntry(token: string, clarificationEntryId: string): Promise<ClarificationEntry> {
    await validator.readClarificationEntry(token, clarificationEntryId)

    if (!this.idEntries[clarificationEntryId]) {
      throw new NoSuchClarificationEntry()
    }
    const entry = this.idEntries[clarificationEntryId]
    await this.getClarificationById(token, entry.clarificationId)
    const me = await this.authService.getMe(token)

    this.entryRead[`${me.id}:${entry.id}`] = true
    return lodash.clone({
      ...entry,
      read: true,
    })
  }

  private readWrapper(userId: string): (entry: ClarificationEntry) => ClarificationEntry {
    return entry => ({
      ...entry,
      read: !!this.entryRead[`${userId}:${entry.id}`],
    })
  }
}
