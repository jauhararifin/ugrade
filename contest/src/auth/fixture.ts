import { CredentialModel } from './store'
import {
  UserNewTest1,
  UserTest1,
  UserTest2,
  UserNewTest2,
  UserTest3,
  UserNewTest3,
  UserAdmin3,
  UserTest4,
  UserNewTest4,
} from '../user'
import { hashSync } from 'bcrypt'

export const credentials: CredentialModel[] = [
  { userId: UserTest1.id, password: hashSync('test', 10), token: '' },
  { userId: UserNewTest1.id, password: hashSync('newtest', 10), token: '' },
  { userId: UserTest2.id, password: hashSync('test', 10), token: '' },
  { userId: UserNewTest2.id, password: hashSync('newtest', 10), token: '' },
  { userId: UserTest3.id, password: hashSync('test', 10), token: '' },
  { userId: UserNewTest3.id, password: hashSync('newtest', 10), token: '' },
  { userId: UserAdmin3.id, password: hashSync('admin', 10), token: '' },
  { userId: UserTest4.id, password: hashSync('test', 10), token: '' },
  { userId: UserNewTest4.id, password: hashSync('newtest', 10), token: '' },
]
