import { CredentialModel } from './model'

export interface AuthStore {
  getCredentialByUserId(userId: string): Promise<CredentialModel>
  getCredentialByToken(token: string): Promise<CredentialModel>
  putUserCredential(credential: CredentialModel): Promise<CredentialModel>
}
