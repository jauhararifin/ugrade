import { hashSync } from 'bcrypt'
import {
  ContestArkav4Final,
  ContestArkav4Qual,
  ContestArkav5Final,
  ContestArkav5Qual,
} from 'ugrade/contest/store'
import { Permission, User } from '../user'

export const adminPermissions = [
  Permission.InfoUpdate,
  Permission.AnnouncementCreate,
  Permission.AnnouncementRead,

  Permission.ProblemsCreate,
  Permission.ProblemsRead,
  Permission.ProblemsReadDisabled,
  Permission.ProblemsUpdate,
  Permission.ProblemsDelete,

  Permission.UsersInvite,
  Permission.UsersPermissionsUpdate,
  Permission.UsersDelete,

  Permission.ProfilesRead,
]

export const contestantPermissions = [
  Permission.AnnouncementRead,
  Permission.ProblemsRead,
]

export const UserTest1: User = {
  id: '1',
  contestId: ContestArkav4Qual.id,
  username: 'test',
  email: 'test@example.com',
  name: 'Test',
  permissions: contestantPermissions,
  password: hashSync('test', 10),
  token: '',
}

export const UserNewTest1: User = {
  id: '2',
  contestId: ContestArkav4Qual.id,
  username: '',
  email: 'newtest@example.com',
  name: 'New Test',
  permissions: contestantPermissions,
  password: hashSync('newtest', 10),
  token: '',
}

export const UserTest2: User = {
  id: '3',
  contestId: ContestArkav4Final.id,
  username: 'test',
  email: 'test@example.com',
  name: 'Test',
  permissions: contestantPermissions,
  password: hashSync('test', 10),
  token: '',
}

export const UserNewTest2: User = {
  id: '4',
  contestId: ContestArkav4Final.id,
  username: '',
  email: 'newtest@example.com',
  name: 'New Test',
  permissions: contestantPermissions,
  password: hashSync('newtest', 10),
  token: '',
}

export const UserAdmin3: User = {
  id: 'admin3',
  contestId: ContestArkav5Qual.id,
  username: 'admin',
  email: 'admin@example.com',
  name: 'Administrator',
  permissions: adminPermissions.slice(),
  password: hashSync('test', 10),
  token: '',
}

export const UserTest3: User = {
  id: '5',
  contestId: ContestArkav5Qual.id,
  username: 'test',
  email: 'test@example.com',
  name: 'Test',
  permissions: contestantPermissions,
  password: hashSync('newtest', 10),
  token: '',
}

export const UserNewTest3: User = {
  id: '6',
  contestId: ContestArkav5Qual.id,
  username: '',
  email: 'newtest@example.com',
  name: 'New Test',
  permissions: contestantPermissions,
  password: hashSync('admin', 10),
  token: '',
}

export const UserTest4: User = {
  id: '7',
  contestId: ContestArkav5Final.id,
  username: 'test',
  email: 'test@example.com',
  name: 'Test',
  permissions: contestantPermissions,
  password: hashSync('test', 10),
  token: '',
}

export const UserNewTest4: User = {
  id: '8',
  contestId: ContestArkav5Final.id,
  username: '',
  email: 'newtest@example.com',
  name: 'New Test',
  permissions: contestantPermissions,
  password: hashSync('newtest', 10),
  token: '',
}

export const users = [
  UserTest1,
  UserNewTest1,
  UserTest2,
  UserNewTest2,
  UserTest3,
  UserNewTest3,
  UserAdmin3,
  UserTest4,
  UserNewTest4,
]
