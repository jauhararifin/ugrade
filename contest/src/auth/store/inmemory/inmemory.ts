import { AuthStore } from '../store'
import { CredentialModel } from '../model'
import lodash from 'lodash'
import { NoSuchCredential } from '../NoSuchCredential'

export class InMemoryAuthStore implements AuthStore {
  private credentials: CredentialModel[]
  private credentialUser: { [userId: string]: CredentialModel }
  private credentialToken: { [token: string]: CredentialModel }

  constructor(credentials: CredentialModel[]) {
    this.credentials = lodash.cloneDeep(credentials)
    this.credentialUser = {}
    this.credentialToken = {}
    for (const cred of this.credentials) {
      this.credentialUser[cred.userId] = cred
      if (cred.token && cred.token.length > 0) {
        this.credentialToken[cred.token] = cred
      }
    }
  }

  async getCredentialByUserId(userId: string): Promise<CredentialModel> {
    if (this.credentialUser[userId]) {
      return this.credentialUser[userId]
    }
    throw new NoSuchCredential('No Such Credential')
  }

  async getCredentialByToken(token: string): Promise<CredentialModel> {
    if (this.credentialToken[token]) {
      return this.credentialToken[token]
    }
    throw new NoSuchCredential('No Such Credential')
  }

  async putUserCredential(
    credential: CredentialModel
  ): Promise<CredentialModel> {
    this.credentials = this.credentials
      .filter(c => c.userId !== credential.userId)
      .slice()
    if (this.credentialUser[credential.userId])
      delete this.credentialUser[credential.userId]
    if (credential.token.length > 0 && this.credentialToken[credential.token])
      delete this.credentialToken[credential.token]
    const newCred = lodash.cloneDeep(credential)
    this.credentials.push(newCred)
    this.credentialUser[newCred.userId] = newCred
    this.credentialToken[newCred.token] = newCred
    return newCred
  }
}
